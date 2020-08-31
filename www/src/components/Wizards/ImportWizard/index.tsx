import React, { useState } from "react";
import _merge from "lodash/merge";

import { Typography } from "@material-ui/core";

import WizardDialog from "../WizardDialog";
import Step1Columns from "./Step1Columns";
import Step2Rename from "./Step2Rename";

import { ColumnConfig } from "hooks/useFiretable/useTableConfig";
import { useFiretableContext } from "contexts/firetableContext";
import { FieldType } from "constants/fields";

export type TableColumnsConfig = { [key: string]: ColumnConfig };

export interface IStepProps {
  config: TableColumnsConfig;
  setConfig: React.Dispatch<React.SetStateAction<TableColumnsConfig>>;
  updateConfig: (value: Partial<ColumnConfig>) => void;
}

export default function ImportWizard() {
  const [config, setConfig] = useState<TableColumnsConfig>({
    attachments: {
      fieldName: "attachments",
      key: "attachments",
      name: "attachments",
      type: FieldType.shortText,
      index: 0,
    },
    calendarEventDescription: {
      fieldName: "calendarEventDescription",
      key: "calendarEventDescription",
      name: "calendarEventDescription",
      type: FieldType.shortText,
      index: 1,
    },
    email: {
      fieldName: "email",
      key: "email",
      name: "email",
      type: FieldType.shortText,
      index: 2,
    },
    isInvestor: {
      fieldName: "isInvestor",
      key: "isInvestor",
      name: "isInvestor",
      type: FieldType.shortText,
      index: 3,
    },
    introVideo: {
      fieldName: "introVideo",
      key: "introVideo",
      name: "introVideo",
      type: FieldType.shortText,
      index: 4,
    },
    introDemoDay: {
      fieldName: "introDemoDay",
      key: "introDemoDay",
      name: "introDemoDay",
      type: FieldType.shortText,
      index: 5,
    },
    sectors: {
      fieldName: "sectors",
      key: "sectors",
      name: "sectors",
      type: FieldType.shortText,
      index: 6,
    },
    resend: {
      fieldName: "resend",
      key: "resend",
      name: "resend",
      type: FieldType.shortText,
      index: 7,
    },
    showOnDemoDayWebsite: {
      fieldName: "showOnDemoDayWebsite",
      key: "showOnDemoDayWebsite",
      name: "showOnDemoDayWebsite",
      type: FieldType.shortText,
      index: 8,
    },
  });
  const updateConfig: IStepProps["updateConfig"] = (value) => {
    setConfig((prev) => _merge(prev, value));
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
                Start by choosing which columns you want to display.
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
      ]}
      onFinish={() => alert("FINISHED")}
    />
  );
}
