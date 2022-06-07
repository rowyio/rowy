import { useState, useMemo, useCallback } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { mergeWith, find, isEqual } from "lodash-es";
import { ITableModalProps } from "@src/components/TableModals";

import {
  useTheme,
  useMediaQuery,
  Typography,
  Link,
  Alert,
  AlertTitle,
} from "@mui/material";

import WizardDialog from "@src/components/TableModals/WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2NewColumns from "./Step2NewColumns";
import Step3Preview from "./Step3Preview";

import {
  tableScope,
  tableSchemaAtom,
  addColumnAtom,
  addRowAtom,
  importCsvAtom,
  ImportCsvData,
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
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const addColumn = useSetAtom(addColumnAtom, tableScope);
  // const addRow = useSetAtom(addRowAtom, tableScope);
  const [{ importType, csvData }] = useAtom(importCsvAtom, tableScope);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = useMemoValue(tableSchema.columns ?? {}, isEqual);

  const [config, setConfig] = useState<CsvConfig>({
    pairs: [],
    newColumns: [],
  });
  const updateConfig: IStepProps["updateConfig"] = useCallback((value) => {
    setConfig((prev) => ({
      ...mergeWith(prev, value, (objValue, srcValue) =>
        Array.isArray(objValue) ? objValue.concat(srcValue) : undefined
      ),
    }));
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

  const handleFinish = () => {
    if (!columns || !parsedRows) return;
    enqueueSnackbar("Importing data…");
    // Add all new rows — synchronous
    // FIXME:
    // addRows(parsedRows.map((r) => ({ data: r })).reverse(), true);

    // Add any new columns to the end
    for (const col of config.newColumns) addColumn({ config: col });
    logEvent(analytics, "import_success", { type: importType });

    // Close wizard
    onClose();
  };

  if (!csvData) return null;

  return (
    <WizardDialog
      open
      onClose={onClose}
      title="Import CSV or TSV"
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
