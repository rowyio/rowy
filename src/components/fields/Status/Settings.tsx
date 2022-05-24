import { useState } from "react";
import { ISettingsProps } from "@src/components/fields/types";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ConditionModal from "./ConditionModal";
import ConditionList from "./ConditionList";

export interface IConditionModal {
  isOpen: boolean;
  index: number | null;
  condition: {
    type: string;
    value: any;
    label: string;
    operator: string | undefined;
  };
}

export const EMPTY_STATE: IConditionModal = {
  index: null,
  isOpen: false,
  condition: {
    type: "null",
    value: null,
    label: "",
    operator: "==",
  },
};

export default function Settings({ onChange, config }: ISettingsProps) {
  const [modal, setModal] = useState(EMPTY_STATE);
  return (
    <>
      <ConditionList config={config} setModal={setModal} />
      <Button
        onClick={() => setModal({ ...EMPTY_STATE, isOpen: true })}
        startIcon={<AddIcon />}
      >
        Add condition
      </Button>
      <ConditionModal
        modal={modal}
        setModal={setModal}
        conditions={config.conditions}
        setConditions={onChange("conditions")}
      />
    </>
  );
}
