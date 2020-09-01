import React, { useState } from "react";
import _merge from "lodash/merge";

import { Typography } from "@material-ui/core";

import WizardDialog from "../WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2Rename from "./Step2Rename";
import Step3Types from "./Step3Types";
import Step4Preview from "./Step4Preview";

import { ColumnConfig } from "hooks/useFiretable/useTableConfig";
import { useFiretableContext } from "contexts/firetableContext";

export type TableColumnsConfig = { [key: string]: ColumnConfig };

export interface IStepProps {
  config: TableColumnsConfig;
  setConfig: React.Dispatch<React.SetStateAction<TableColumnsConfig>>;
  updateConfig: (value: Partial<ColumnConfig>) => void;
}

export default function ImportWizard() {
  const [config, setConfig] = useState<TableColumnsConfig>({});
  const updateConfig: IStepProps["updateConfig"] = (value) => {
    setConfig((prev) => ({ ..._merge(prev, value) }));
  };

  const { tableState } = useFiretableContext();
  if (tableState?.rows.length === 0) return null;

  return (
    <WizardDialog
      open
      title="Import"
      steps={[
        {
          title: "choose columns",
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
            />
          ),
          disableNext: Object.keys(config).length === 0,
        },
        {
          title: "rename columns",
          description:
            "Rename your Firetable columns with user-friendly names. These changes will not update the field names in your database.",
          content: (
            <Step2Rename
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
            />
          ),
        },
        {
          title: "set column types",
          description:
            "Set the type of each column to display your data correctly. Some column types have been suggested based off your data.",
          content: (
            <Step3Types
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
            />
          ),
        },
        {
          title: "preview",
          description:
            "Preview your data with your configured columns. You can change column types by clicking “Edit Type” from the column menu at any time.",
          content: (
            <Step4Preview
              config={config}
              setConfig={setConfig}
              updateConfig={updateConfig}
            />
          ),
        },
      ]}
      onFinish={() => alert("FINISHED")}
    />
  );
}
