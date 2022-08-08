import { useState, useCallback, useRef, useMemo } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useSnackbar } from "notistack";
import { uniqBy, isEqual, find } from "lodash-es";
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

import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  addColumnAtom,
  bulkAddRowsAtom,
  importAirtableAtom,
  ImportAirtableData,
  tableModalAtom,
} from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";
import { getFieldProp } from "@src/components/fields";
import Step2NewColumns from "./Step2NewColumns";
import SnackbarProgress, {
  ISnackbarProgressRef,
} from "@src/components/SnackbarProgress";
import { FieldType } from "@src/constants/fields";

export type AirtableConfig = {
  pairs: { fieldKey: string; columnKey: string }[];
  newColumns: ColumnConfig[];
};

export interface IStepProps {
  airtableData: NonNullable<ImportAirtableData>;
  config: AirtableConfig;
  setConfig: React.Dispatch<React.SetStateAction<AirtableConfig>>;
  updateConfig: (value: Partial<AirtableConfig>) => void;
  isXs: boolean;
}

export default function ImportAirtableWizard({ onClose }: ITableModalProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const addColumn = useSetAtom(addColumnAtom, tableScope);
  const bulkAddRows = useSetAtom(bulkAddRowsAtom, tableScope);
  const [{ airtableData, tableId, baseId, apiKey }] = useAtom(
    importAirtableAtom,
    tableScope
  );
  const setTableModal = useSetAtom(tableModalAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const snackbarProgressRef = useRef<ISnackbarProgressRef>();

  const columns = useMemoValue(tableSchema.columns ?? {}, isEqual);

  const [config, setConfig] = useState<AirtableConfig>({
    pairs: [],
    newColumns: [],
  });

  const updateConfig: IStepProps["updateConfig"] = useCallback((value) => {
    setConfig((prev) => {
      const pairs = uniqBy([...prev.pairs, ...(value.pairs ?? [])], "fieldKey");
      const newColumns = uniqBy(
        [...prev.newColumns, ...(value.newColumns ?? [])],
        "key"
      ).filter((col) => pairs.some((pair) => pair.columnKey === col.key));
      return { pairs, newColumns };
    });
  }, []);

  const fetchRecords = async (offset?: string) => {
    const url = offset
      ? `https://api.airtable.com/v0/${baseId}/${tableId}?offset=${offset}`
      : `https://api.airtable.com/v0/${baseId}/${tableId}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }).then((response) => response.json());
    return response;
  };

  const airtableFieldParser = (fieldType: FieldType): any => {
    switch (fieldType) {
      case FieldType.multiSelect:
        return (v: string[]) => v;
      default:
        return getFieldProp("csvImportParser", fieldType);
    }
  };

  const parsedRows = (currentBatch: any[]): any[] =>
    currentBatch.map((record) =>
      config.pairs.reduce((a, pair) => {
        const matchingColumn =
          columns[pair.columnKey] ??
          find(config.newColumns, { key: pair.columnKey });
        const parser = airtableFieldParser(matchingColumn.type);
        const value = parser
          ? parser(record.fields[pair.fieldKey], matchingColumn.config)
          : record.fields[pair.fieldKey];
        return { ...a, [pair.columnKey]: value };
      }, {})
    );

  const handleFinish = async () => {
    console.time("importAirtable");
    snackbarProgressRef.current?.setProgress(0);
    const loadingSnackbar = enqueueSnackbar(
      `Importing rows. This might take a while.`,
      {
        persist: true,
        action: (
          <SnackbarProgress
            stateRef={snackbarProgressRef}
            target={0}
            label=" rows"
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

    try {
      let currentBatch: any[] = [];
      const fetcher = async (i: number, offset: string) => {
        // Airtable Rate Limits: 5 req/sec , 100rows/req
        if (!offset) return;
        const { records, offset: currentOffset } = await fetchRecords(offset);
        currentBatch = [...currentBatch, ...records];
        snackbarProgressRef.current?.setTarget((prev) => prev + records.length);
        if (i < 5) {
          fetcher(++i, currentOffset);
        } else {
          setTimeout(() => {
            bulkAddRows({
              rows: parsedRows(currentBatch),
              collection: tableSettings.collection,
              onBatchCommit: () =>
                snackbarProgressRef.current?.setProgress(
                  (prev) => prev + currentBatch.length
                ),
            });
            currentBatch = [];
            fetcher(0, currentOffset);
          }, 1050);
        }
      };

      onClose();

      const promises: Promise<void>[] = [];
      for (const col of config.newColumns)
        promises.push(addColumn({ config: col }));

      await Promise.all(promises);

      const { records, offset } = await fetchRecords();
      currentBatch = records;
      snackbarProgressRef.current?.setTarget(currentBatch.length);
      await fetcher(1, offset);
      if (currentBatch.length > 0) {
        await bulkAddRows({
          rows: parsedRows(currentBatch),
          collection: tableSettings.collection,
          onBatchCommit: () =>
            snackbarProgressRef.current?.setProgress(
              (prev) => prev + currentBatch.length
            ),
        });
      }
    } catch (e) {
      enqueueSnackbar((e as Error).message, { variant: "error" });
    } finally {
      closeSnackbar(loadingSnackbar);
      closeSnackbar(warningSnackbar);
    }
    console.timeEnd("importAirtable");
  };

  if (!airtableData) {
    setTableModal(RESET);
    return null;
  }

  return (
    <WizardDialog
      open
      onClose={onClose}
      title={`Import from Airtable`}
      steps={
        [
          {
            title: "Choose columns",
            description: (
              <>
                <Typography paragraph>Base ID: {baseId}</Typography>
                <Typography paragraph>Table ID: {tableId}</Typography>
                <Typography paragraph>
                  Select or add the columns to be imported to your table.
                </Typography>
              </>
            ),
            content: (
              <Step1Columns
                airtableData={airtableData}
                config={config}
                setConfig={setConfig}
                updateConfig={updateConfig}
                isXs={isXs}
              />
            ),
          },
          config.newColumns.length > 0 && {
            title: "Set column types",
            description:
              "Set the type of each column to display your data correctly. Some column types have been suggested based on your data.",
            content: (
              <Step2NewColumns
                airtableData={airtableData}
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
        ].filter((x) => x) as any
      }
      onFinish={handleFinish}
    />
  );
}
