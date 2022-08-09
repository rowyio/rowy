import { useState, useCallback, useRef } from "react";
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
  const countRef = useRef(0);
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
        return null;
    }
  };

  const parsedRecords = (records: any[]): any[] =>
    records.map((record) =>
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
      const fetcher = async (i: number, offset?: string): Promise<void> => {
        console.log(i, offset, promises);
        if (offset) {
          const { records, offset: nextPage } = await fetchRecords(offset);
          snackbarProgressRef.current?.setTarget(
            (prev) => prev + records.length
          );
          promises.push(
            bulkAddRows({
              rows: parsedRecords(records),
              collection: tableSettings.collection,
            }).then(() => {
              countRef.current += records.length;
              snackbarProgressRef.current?.setProgress(
                (prev) => prev + records.length
              );
            })
          );
          if (i < RATE_LIMIT.REQ_PER_SECOND - 1) {
            promises.push(fetcher(++i, nextPage));
          } else {
            promises.push(timeout(1050).then(() => fetcher(0, nextPage)));
          }
        }
      };
      const recursiveAll = async (): Promise<void[]> => {
        return Promise.all(promises).then((result) => {
          if (result.length === promises.length) {
            return result;
          }
          return recursiveAll();
        });
      };

      onClose();

      for (const col of config.newColumns)
        promises.push(addColumn({ config: col }));

      await Promise.all(promises);

      const { records, offset: nextPage } = await fetchRecords();
      snackbarProgressRef.current?.setTarget(records.length);
      countRef.current += records.length;
      console.log("before fetcher");
      await fetcher(1, nextPage);
      await recursiveAll();
      enqueueSnackbar(
        `Imported ${Number(countRef.current).toLocaleString()} rows`,
        { variant: "success" }
      );
      console.log("after fetcher");
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
