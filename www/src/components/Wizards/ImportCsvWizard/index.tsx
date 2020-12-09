import React, { useState, useEffect } from "react";
import _mergeWith from "lodash/mergeWith";
import _find from "lodash/find";
import { parseJSON } from "date-fns";

import {
  useTheme,
  useMediaQuery,
  Grid,
  Typography,
  Link,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";

import WizardDialog from "../WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2NewColumns from "./Step2NewColumns";
import Step3Preview from "./Step3Preview";

import { ColumnConfig } from "hooks/useFiretable/useTableConfig";
import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";

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

  const handleFinish = () => {
    if (!tableState || !tableActions || !csvData) return;
    // Add any new columns to the end
    config.newColumns.forEach((col) =>
      setTimeout(() => {
        tableActions.column.add(col.name, col.type, col);
      })
    );
    // Add all new rows
    csvData.rows.forEach((row) => {
      const newRow = config.pairs.reduce((a, pair) => {
        const matchingColumn =
          tableState.columns[pair.columnKey] ??
          _find(config.newColumns, { key: pair.columnKey });
        const value =
          matchingColumn.type === FieldType.date ||
          matchingColumn.type === FieldType.dateTime
            ? parseJSON(row[pair.csvKey])
            : row[pair.csvKey];
        return { ...a, [pair.columnKey]: value };
      }, {});
      tableActions.row.add(newRow);
    });
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
            title: "choose columns",
            description: (
              <>
                <Typography paragraph>
                  Select or add the columns to be imported to your table.
                </Typography>
                <Grid container spacing={1} wrap="nowrap">
                  <Grid item>
                    <WarningIcon />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle2" gutterBottom>
                      Importing dates?
                    </Typography>
                    <Typography variant="body2">
                      Make sure your dates are in UTC time and{" "}
                      <Link
                        href="https://date-fns.org/v2.16.1/docs/parseJSON"
                        rel="noopener"
                        target="_blank"
                      >
                        a supported format
                      </Link>
                      . If they’re not, you will need to re-import your CSV
                      data.
                    </Typography>
                  </Grid>
                </Grid>
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
            title: "set column types",
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
            title: "preview",
            description:
              "Preview your data with your configured columns. You can change column types by clicking “Edit Type” from the column menu at any time.",
            content: (
              <Step3Preview
                csvData={csvData}
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
