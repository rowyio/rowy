import React, { useState, useEffect } from "react";
import _merge from "lodash/merge";

import { useTheme, useMediaQuery, Typography } from "@mui/material";

import WizardDialog from "../WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2Rename from "./Step2Rename";
import Step3Types from "./Step3Types";
import Step4Preview from "./Step4Preview";

import { ColumnConfig } from "@src/hooks/useTable/useTableConfig";
import { useProjectContext } from "@src/contexts/ProjectContext";

export type TableColumnsConfig = { [key: string]: ColumnConfig };

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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  const { tableState, tableActions, importWizardRef } = useProjectContext();

  const [open, setOpen] = useState(false);
  if (importWizardRef) importWizardRef.current = { open, setOpen };

  const [config, setConfig] = useState<TableColumnsConfig>({});
  const updateConfig: IStepProps["updateConfig"] = (value) => {
    setConfig((prev) => ({ ..._merge(prev, value) }));
  };

  useEffect(() => {
    if (!tableState || !open) return;

    if (Array.isArray(tableState.filters) && tableState.filters?.length > 0)
      tableActions!.table.filter([]);

    if (Array.isArray(tableState.orderBy) && tableState.orderBy?.length > 0)
      tableActions!.table.orderBy([]);
  }, [open, tableState]);

  if (tableState?.rows.length === 0) return null;

  const handleFinish = () => {
    tableActions?.table.updateConfig("columns", config);
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
