import { useState, useMemo, useCallback, useRef } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useSnackbar } from "notistack";
import { uniqBy, find, isEqual } from "lodash-es";
import { ITableModalProps } from "@src/components/TableModals";

import {
  useTheme,
  useMediaQuery,
  Typography,
  Link,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";

import WizardDialog from "@src/components/TableModals/WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2NewColumns from "./Step2NewColumns";
import Step3Preview from "./Step3Preview";
import SnackbarProgress, {
  ISnackbarProgressRef,
} from "@src/components/SnackbarProgress";

import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  addColumnAtom,
  bulkAddRowsAtom,
  importCsvAtom,
  ImportCsvData,
  tableModalAtom,
} from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "@src/analytics";

export type CsvConfig = {
  pairs: { csvKey: string; columnKey: string }[];
  newColumns: ColumnConfig[];
};

export interface IStepProps {
  csvData: NonNullable<ImportCsvData>;
  config: CsvConfig;
  setConfig: React.Dispatch<React.SetStateAction<CsvConfig>>;
  updateConfig: (value: Partial<CsvConfig>) => void;
  isXs: boolean;
}

export default function ImportCsvWizard({ onClose }: ITableModalProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const addColumn = useSetAtom(addColumnAtom, tableScope);
  const bulkAddRows = useSetAtom(bulkAddRowsAtom, tableScope);
  const [{ importType, csvData }] = useAtom(importCsvAtom, tableScope);
  const setTableModal = useSetAtom(tableModalAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const snackbarProgressRef = useRef<ISnackbarProgressRef>();

  const columns = useMemoValue(tableSchema.columns ?? {}, isEqual);

  const [config, setConfig] = useState<CsvConfig>({
    pairs: [],
    newColumns: [],
  });
  const updateConfig: IStepProps["updateConfig"] = useCallback((value) => {
    setConfig((prev) => {
      const pairs = uniqBy([...prev.pairs, ...(value.pairs ?? [])], "csvKey");
      const newColumns = uniqBy(
        [...prev.newColumns, ...(value.newColumns ?? [])],
        "key"
      ).filter((col) => pairs.some((pair) => pair.columnKey === col.key));

      return { pairs, newColumns };
    });
  }, []);

  const parsedRows: any[] = useMemo(() => {
    if (!columns || !csvData) return [];
    return csvData.rows.map((row) =>
      config.pairs.reduce((a, pair) => {
        const matchingColumn =
          columns[pair.columnKey] ??
          find(config.newColumns, { key: pair.columnKey });
        const csvFieldParser = getFieldProp(
          "csvImportParser",
          matchingColumn.type
        );
        const value = csvFieldParser
          ? csvFieldParser(row[pair.csvKey], matchingColumn.config)
          : row[pair.csvKey];
        return { ...a, [pair.columnKey]: value };
      }, {})
    );
  }, [csvData, columns, config]);

  const handleFinish = async () => {
    if (!parsedRows) return;
    console.time("importCsv");
    snackbarProgressRef.current?.setProgress(0);
    const loadingSnackbar = enqueueSnackbar(
      `Importing ${Number(
        parsedRows.length
      ).toLocaleString()} rows. This might take a while.`,
      {
        persist: true,
        action: (
          <SnackbarProgress
            stateRef={snackbarProgressRef}
            target={Math.ceil(parsedRows.length / 500)}
            label=" batches"
          />
        ),
      }
    );

    const warningSnackbar = enqueueSnackbar(
      "Do not close this page until the import is complete",
      {
        variant: "warning",
        persist: true,
        action: (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => closeSnackbar(warningSnackbar)}
          >
            OK
          </Button>
        ),
      }
    );

    // Run add column & batch write at the same time
    const promises: Promise<void>[] = [];

    try {
      // Add any new columns to the end
      for (const col of config.newColumns)
        promises.push(addColumn({ config: col }));

      promises.push(
        bulkAddRows({
          rows: parsedRows,
          collection: tableSettings.collection,
          onBatchCommit: (batchNumber: number) =>
            snackbarProgressRef.current?.setProgress(batchNumber),
        })
      );

      onClose();
      await Promise.all(promises);
      logEvent(analytics, "import_success", { type: importType });
      enqueueSnackbar(
        `Imported ${Number(parsedRows.length).toLocaleString()} rows`,
        { variant: "success" }
      );
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    } finally {
      closeSnackbar(loadingSnackbar);
      closeSnackbar(warningSnackbar);
    }
    console.timeEnd("importCsv");
  };

  if (!csvData) {
    setTableModal(RESET);
    return null;
  }

  return (
    <WizardDialog
      open
      onClose={onClose}
      title={`Import ${importType.toUpperCase()}`}
      steps={
        [
          {
            title: "Choose columns",
            description: (
              <>
                <Typography paragraph>
                  Select or add the columns to be imported to your table.
                </Typography>
                <Alert severity="warning">
                  <AlertTitle>Importing dates?</AlertTitle>
                  Make sure they’re in UTC time and{" "}
                  <Link
                    href="https://date-fns.org/v2.16.1/docs/parseJSON"
                    rel="noopener"
                    target="_blank"
                    color="inherit"
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    a supported format
                  </Link>
                  . If they’re not, you’ll need to re-import your CSV data.
                </Alert>
              </>
            ),
            content: (
              <Step1Columns
                csvData={csvData}
                config={config}
                setConfig={setConfig}
                updateConfig={updateConfig}
                isXs={isXs}
              />
            ),
            disableNext: config.pairs.length === 0,
          },
          config.newColumns.length > 0 && {
            title: "Set column types",
            description:
              "Set the type of each column to display your data correctly. Some column types have been suggested based on your data.",
            content: (
              <Step2NewColumns
                csvData={csvData}
                config={config}
                setConfig={setConfig}
                updateConfig={updateConfig}
                isXs={isXs}
              />
            ),
            disableNext: config.newColumns.reduce(
              (a, c) => a || (c.type as any) === "",
              false
            ),
          },
          {
            title: "Preview",
            description:
              "Preview your data with your configured columns. You can change column types by clicking “Edit type” from the column menu at any time.",
            content: (
              <Step3Preview
                csvData={{ ...csvData, rows: parsedRows }}
                config={config}
                setConfig={setConfig}
                updateConfig={updateConfig}
                isXs={isXs}
              />
            ),
          },
        ].filter((x) => x) as any
      }
      onFinish={handleFinish}
    />
  );
}
