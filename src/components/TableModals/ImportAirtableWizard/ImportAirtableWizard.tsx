import { useState, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { uniqBy } from "lodash-es";
import { ITableModalProps } from "@src/components/TableModals";

import { useTheme, useMediaQuery } from "@mui/material";

import WizardDialog from "@src/components/TableModals/WizardDialog";
import Step1Columns from "./Step1Columns";

import {
  tableScope,
  tableModalAtom,
  importAirtableAtom,
  ImportAirtableData,
} from "@src/atoms/tableScope";
import { ColumnConfig } from "@src/types/table";

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
  const [{ airtableData }] = useAtom(importAirtableAtom, tableScope);
  const setTableModal = useSetAtom(tableModalAtom, tableScope);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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

  if (!airtableData) {
    setTableModal(RESET);
    return null;
  }

  return (
    <WizardDialog
      open
      onClose={onClose}
      title={`Import from Airtable`}
      steps={[
        {
          title: "Hello, World!",
          description: <span>Description</span>,
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
      ]}
      onFinish={() => {}}
    />
  );
}
