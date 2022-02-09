import { useState, useMemo } from "react";
import { useSnackbar } from "notistack";
import _mergeWith from "lodash/mergeWith";
import _find from "lodash/find";

import {
  useTheme,
  useMediaQuery,
  Typography,
  Link,
  Alert,
  AlertTitle,
} from "@mui/material";

import WizardDialog from "../WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2NewColumns from "./Step2NewColumns";
import Step3Preview from "./Step3Preview";

import { ColumnConfig } from "@src/hooks/useTable/useTableConfig";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { getFieldProp } from "@src/components/fields";
import { analytics } from "@src/analytics";
import { ImportType } from "@src/components/TableHeader/ImportCsv";

export type CsvConfig = {
  pairs: { csvKey: string; columnKey: string }[];
  newColumns: ColumnConfig[];
};

export interface IStepProps {
  csvData: NonNullable<IImportCsvWizardProps["csvData"]>;
  config: CsvConfig;
  setConfig: React.Dispatch<React.SetStateAction<CsvConfig>>;
  updateConfig: (value: Partial<ColumnConfig>) => void;
  isXs: boolean;
}

export interface IImportCsvWizardProps {
  importType: ImportType;
  handleClose: () => void;
  csvData: {
    columns: string[];
    rows: Record<string, any>[];
  } | null;
}

export default function ImportCsvWizard({
  importType,
  handleClose,
  csvData,
}: IImportCsvWizardProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(true);

  const { tableState, tableActions, addRows } = useProjectContext();
  const { enqueueSnackbar } = useSnackbar();

  const [config, setConfig] = useState<CsvConfig>({
    pairs: [],
    newColumns: [],
  });
  const updateConfig: IStepProps["updateConfig"] = (value) => {
    setConfig((prev) => ({
      ..._mergeWith(prev, value, (objValue, srcValue) =>
        Array.isArray(objValue) ? objValue.concat(srcValue) : undefined
      ),
    }));
  };

  const parsedRows: any[] = useMemo(() => {
    if (!tableState || !csvData) return [];
    return csvData.rows.map((row) =>
      config.pairs.reduce((a, pair) => {
        const matchingColumn =
          tableState.columns[pair.columnKey] ??
          _find(config.newColumns, { key: pair.columnKey });
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
  }, [csvData, tableState, config]);

  const handleFinish = () => {
    if (!tableState || !tableActions || !addRows || !parsedRows) return;
    enqueueSnackbar("Importing data…");
    // Add all new rows — synchronous
    addRows(parsedRows.map((r) => ({ data: r })).reverse(), true);

    // Add any new columns to the end
    for (const col of config.newColumns) {
      tableActions.column.add(col.name, col.type, col);
    }
    analytics.logEvent("import_success", { type: importType }); //change this import_success
    // Close wizard
    setOpen(false);
    setTimeout(handleClose, 300);
  };

  if (!csvData) return null;

  return (
    <WizardDialog
      open={open}
      onClose={() => {
        setOpen(false);
        setTimeout(handleClose, 300);
      }}
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
