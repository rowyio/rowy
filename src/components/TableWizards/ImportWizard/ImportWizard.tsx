import { useState, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { merge } from "lodash-es";

import { useTheme, useMediaQuery, Typography } from "@mui/material";

import WizardDialog from "@src/components/TableWizards/WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2Rename from "./Step2Rename";
import Step3Types from "./Step3Types";
import Step4Preview from "./Step4Preview";

import {
  tableScope,
  tableFiltersAtom,
  tableOrdersAtom,
  tableRowsAtom,
} from "@src/atoms/tableScope";
import { TableSchema, ColumnConfig } from "@src/types/table";

export type TableColumnsConfig = NonNullable<TableSchema["columns"]>;

export type ImportWizardRef = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IStepProps {
  config: TableColumnsConfig;
  setConfig: React.Dispatch<React.SetStateAction<TableColumnsConfig>>;
  updateConfig: (value: Partial<ColumnConfig>) => void;
  isXs: boolean;
}

export default function ImportWizard() {
  const setTableFilters = useSetAtom(tableFiltersAtom, tableScope);
  const setTableOrders = useSetAtom(tableOrdersAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  // if (importWizardRef) importWizardRef.current = { open, setOpen };

  const [config, setConfig] = useState<TableColumnsConfig>({});
  const updateConfig: IStepProps["updateConfig"] = useCallback((value) => {
    setConfig((prev) => ({ ...merge(prev, value) }));
  }, []);

  // Reset table filters and orders on open
  useEffect(() => {
    if (!open) return;
    setTableFilters([]);
    setTableOrders([]);
  }, [open, setTableFilters, setTableOrders]);

  if (tableRows.length === 0) return null;

  const handleFinish = () => {
    // FIXME: Investigate if this overwrites
    // tableActions?.table.updateConfig("columns", config);
    setOpen(false);
  };

  return (
    <WizardDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Import"
      steps={[
        {
          title: "Choose columns",
          description: (
            <>
              <Typography gutterBottom>
                It looks like you already have data in this table. You can
                import and view the data by setting up columns for this table.
              </Typography>
              <Typography gutterBottom>
                Start by choosing which columns you want to display, then sort
                your columns.
              </Typography>
            </>
          ),
          content: (
            <Step1Columns
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
              isXs={isXs}
            />
          ),
          disableNext: Object.keys(config).length === 0,
        },
        {
          title: "Rename columns",
          description:
            "Rename your table columns with user-friendly names. These changes will not update the field names in your database.",
          content: (
            <Step2Rename
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
              isXs={isXs}
            />
          ),
        },
        {
          title: "Set column types",
          description:
            "Set the type of each column to display your data correctly. Some column types have been suggested based on your data.",
          content: (
            <Step3Types
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
              isXs={isXs}
            />
          ),
        },
        {
          title: "Preview",
          description:
            "Preview your data with your configured columns. You can change column types by clicking “Edit type” from the column menu at any time.",
          content: (
            <Step4Preview
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
              isXs={isXs}
            />
          ),
        },
      ]}
      onFinish={handleFinish}
    />
  );
}
