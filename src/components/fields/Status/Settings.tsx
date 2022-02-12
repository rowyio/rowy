import { useState } from "react";
import { ISettingsProps } from "../types";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { default as List } from "./ConditionList";
import { default as Modal } from "./ConditionModal";
import createConditionsArr, {
  removeCondition,
  updateCondition,
} from "./utils/conditionArrHelper";

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
  const { conditions } = config;
  const [modalState, setModalState] = useState(EMPTY_STATE);

  const handleAdd = (condition: any) => {
    const arr = createConditionsArr(condition, conditions);
    onChange("conditions")(arr);
    setModalState(EMPTY_STATE);
  };

  const handleSave = (condition: any) => {
    const arr = updateCondition(condition, conditions, modalState.index);
    onChange("conditions")(arr);
    setModalState(EMPTY_STATE);
  };

  const handleRemove = () => {
    const arr = removeCondition(modalState.index, conditions);
    onChange("conditions")(arr);
    setModalState(EMPTY_STATE);
  };

  const handleClose = () => {
    setModalState(EMPTY_STATE);
  };

  return (
    <>
      <List config={config} setModal={setModalState} />
      <Button
        onClick={() => setModalState({ ...EMPTY_STATE, isOpen: true })}
        startIcon={<AddIcon />}
      >
        Add condition
      </Button>
      <Modal
        isEditing={typeof modalState.index === "number"}
        conditions={conditions}
        modalState={modalState}
        setModalState={setModalState}
        handleAdd={handleAdd}
        handleSave={handleSave}
        handleRemove={handleRemove}
        handleClose={handleClose}
      />
    </>
  );
}
