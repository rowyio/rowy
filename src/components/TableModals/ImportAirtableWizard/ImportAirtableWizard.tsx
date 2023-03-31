import { useState, useCallback, useRef } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useSnackbar } from "notistack";
import { uniqBy, isEqual, find } from "lodash-es";
import { ITableModalProps } from "@src/components/TableModals";
import WizardDialog from "@src/components/TableModals/WizardDialog";

import { useTheme, useMediaQuery, Typography, Button } from "@mui/material";

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

import SnackbarProgress, {
  ISnackbarProgressRef,
} from "@src/components/SnackbarProgress";
import { fieldParser } from "@src/components/TableModals/ImportAirtableWizard/utils";
import Step1Columns from "./Step1Columns";
import Step2NewColumns from "./Step2NewColumns";
import Step3Preview from "./Step3Preview";
import useConverter from "@src/components/TableModals/ImportCsvWizard/useConverter";
import useUploadFileFromURL from "@src/components/TableModals/ImportCsvWizard/useUploadFileFromURL";

export type AirtableConfig = {
  pairs: { fieldKey: string; columnKey: string }[];
  newColumns: ColumnConfig[];
  documentId: "auto" | "recordId";
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
  const countRef = useRef(0);
  const columns = useMemoValue(tableSchema.columns ?? {}, isEqual);

  const [config, setConfig] = useState<AirtableConfig>({
    pairs: [],
    newColumns: [],
    documentId: "recordId",
  });
  const { needsUploadTypes, getConverter } = useConverter();
  const { addTask, runBatchedUpload, hasUploadJobs } = useUploadFileFromURL();

  const updateConfig: IStepProps["updateConfig"] = useCallback((value) => {
    setConfig((prev) => {
      const pairs = uniqBy([...prev.pairs, ...(value.pairs ?? [])], "fieldKey");
      const newColumns = uniqBy(
        [...prev.newColumns, ...(value.newColumns ?? [])],
        "key"
      ).filter((col) => pairs?.some((pair) => pair.columnKey === col.key));
      return { ...prev, pairs, newColumns };
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

  const parseRecords = (records: any[]): any[] => {
    if (!columns || !airtableData) return [];
    return records.map((record) =>
      config.pairs.reduce((a, pair) => {
        const matchingColumn =
          columns[pair.columnKey] ??
          find(config.newColumns, { key: pair.columnKey });
        const parser =
          getConverter(matchingColumn.type) || fieldParser(matchingColumn.type);
        const value = parser
          ? parser(record.fields[pair.fieldKey])
          : record.fields[pair.fieldKey];

        if (needsUploadTypes(matchingColumn.type)) {
          if (value && value.length > 0) {
            addTask({
              docRef: {
                path: `${tableSettings.collection}/${record.id}`,
                id: record.id,
              },
              fieldName: pair.columnKey,
              files: value,
            });
          }
        }
        return config.documentId === "recordId"
          ? { ...a, [pair.columnKey]: value, _rowy_ref: { id: record.id } }
          : { ...a, [pair.columnKey]: value };
      }, {})
    );
  };

  const handleFinish = async () => {
    console.time("importAirtable");
    snackbarProgressRef.current?.setProgress(0);
    const loadingSnackbar = enqueueSnackbar(
      `Importing records. This might take a while.`,
      {
        persist: true,
        action: (
          <SnackbarProgress
            stateRef={snackbarProgressRef}
            target={0}
            label=" records"
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
      const promises: Promise<void>[] = [];
      const timeout = (ms: number): Promise<void> =>
        new Promise((resolve) => setTimeout(() => resolve(), ms));

      // Airtable Rate Limits: 5 req/sec
      const RATE_LIMIT = { REQ_PER_SECOND: 5 };
      const fetcher = async (i: number = 0, offset?: string): Promise<void> => {
        const { records, offset: nextPage } = await fetchRecords(offset);
        snackbarProgressRef.current?.setTarget((prev) => prev + records.length);
        promises.push(
          bulkAddRows({
            rows: parseRecords(records),
            collection: tableSettings.collection,
          }).then(() => {
            countRef.current += records.length;
            snackbarProgressRef.current?.setProgress(
              (prev) => prev + records.length
            );
          })
        );
        if (!nextPage) {
          return;
        }
        if (i < RATE_LIMIT.REQ_PER_SECOND - 1) {
          promises.push(fetcher(++i, nextPage));
        } else {
          promises.push(timeout(1050).then(() => fetcher(0, nextPage)));
        }
      };

      const resolveAll = async (): Promise<void[]> => {
        return Promise.all(promises).then((result) => {
          if (result.length === promises.length) {
            return result;
          }
          return resolveAll();
        });
      };

      onClose();

      for (const col of config.newColumns)
        promises.push(addColumn({ config: col }));

      await fetcher();
      await resolveAll();

      enqueueSnackbar(
        `Imported ${Number(countRef.current).toLocaleString()} rows`,
        { variant: "success" }
      );

      if (hasUploadJobs()) {
        await runBatchedUpload();
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
            disableNext: config.pairs.length === 0,
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
          {
            title: "Preview",
            description:
              "Preview your data with your configured columns. You can change column types by clicking “Edit type” from the column menu at any time.",
            content: (
              <Step3Preview
                airtableData={airtableData}
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
