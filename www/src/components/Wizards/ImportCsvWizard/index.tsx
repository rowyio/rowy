import React, { useState, useMemo } from "react";
import _mergeWith from "lodash/mergeWith";
import _find from "lodash/find";
import { parseJSON } from "date-fns";

import { useTheme, useMediaQuery, Typography, Link } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

import WizardDialog from "../WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2NewColumns from "./Step2NewColumns";
import Step3Preview from "./Step3Preview";

import { ColumnConfig } from "hooks/useFiretable/useTableConfig";
import { useFiretableContext } from "contexts/FiretableContext";
import { useSnackContext } from "contexts/SnackContext";
import { getFieldProp } from "components/fields";

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
  handleClose: () => void;
  csvData: {
    columns: string[];
    rows: Record<string, any>[];
  } | null;
}

export default function ImportCsvWizard({
  handleClose,
  csvData,
}: IImportCsvWizardProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));

  const [open, setOpen] = useState(true);

  const { tableState, tableActions } = useFiretableContext();
  const { open: openSnackbar } = useSnackContext();

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
    if (!tableState || !tableActions || !csvData) return [];
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
  }, [csvData, tableState, tableActions, config]);

  const handleFinish = () => {
    if (!tableState || !tableActions || !parsedRows) return;
    openSnackbar({ message: "Importing data…" });
    // Add all new rows — synchronous
    parsedRows?.forEach((newRow) => tableActions.row.add(newRow));

    // Add any new columns to the end
    for (const col of config.newColumns) {
      tableActions.column.add(col.name, col.type, col);
    }
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
      title="Import CSV"
      steps={
        [
          {
            title: "Choose Columns",
            description: (
              <>
                <Typography paragraph>
                  Select or add the columns to be imported to your table.
                </Typography>
                <Alert severity="warning">
                  <AlertTitle>Importing dates?</AlertTitle>
                  Make sure your dates are in UTC time and{" "}
                  <Link
                    href="https://date-fns.org/v2.16.1/docs/parseJSON"
                    rel="noopener"
                    target="_blank"
                  >
                    a supported format
                  </Link>
                  . If they’re not, you will need to re-import your CSV data.
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
            title: "Set Column Types",
            description:
              "Set the type of each column to display your data correctly. Some column types have been suggested based off your data.",
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
              "Preview your data with your configured columns. You can change column types by clicking “Edit Type” from the column menu at any time.",
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
