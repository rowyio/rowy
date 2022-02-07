import { useEffect } from "react";
import _find from "lodash/find";
import Modal from "@src/components/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import { default as Content } from "./ConditionModalContent";
import { EMPTY_STATE } from "./Settings";

export default function ConditionModal({
  modal,
  setModal,
  conditions,
  setConditions,
}) {
  const handleClose = () => setModal(EMPTY_STATE);
  const handleSave = () => {
    let _conditions = [...conditions];
    _conditions[modal.index] = modal.condition;
    setConditions(_conditions);
    setModal(EMPTY_STATE);
  };
  const handleAdd = () => {
    function setConditionHack(type, condition) {
      let rCondition = condition;
      if (type === "undefined") rCondition = { ...condition, value: undefined };
      if (type === "boolean" && typeof condition.value === "object")
        rCondition = { ...condition, value: false }; //Again 'rowy's multiselect does not accept default value'
      return rCondition;
    }
    const modalCondition = setConditionHack(
      modal.condition.type,
      modal.condition
    );
    const noConditions = Boolean(conditions?.length === 0 || !conditions);
    const arr = noConditions
      ? [modalCondition]
      : [...conditions, modalCondition];
    setConditions(arr);
    setModal(EMPTY_STATE);
  };
  const handleRemove = () => {
    const _newConditions = conditions.filter(
      (c, index) => index !== modal.index
    );
    setConditions(_newConditions);
    setModal(EMPTY_STATE);
  };
  const handleUpdate = (key: string) => (value) => {
    const newState = {
      ...modal,
      condition: { ...modal.condition, [key]: value },
    };
    setModal(newState);
  };
  const primaryAction = (index) => {
    return index === null
      ? {
          children: "Add condition",
          onClick: () => handleAdd(),
          disabled: false,
        }
      : {
          children: "Save changes",
          onClick: () => handleSave(),
          disabled: false,
        };
  };
  const secondaryAction = (index) => {
    return index === null
      ? {
          children: "Cancel",
          onClick: () => setModal(EMPTY_STATE),
        }
      : {
          startIcon: <DeleteIcon />,
          children: "Remove condition",
          onClick: () => handleRemove(),
        };
  };

  useEffect(() => {
    handleUpdate("operator")(modal.condition.operator ?? "==");
  }, [modal.condition.type]);
  return (
    <Modal
      open={modal.isOpen}
      title={`${modal.index ? "Edit" : "Add"} condition`}
      maxWidth={"xs"}
      onClose={handleClose}
      actions={{
        primary: primaryAction(modal.index),
        secondary: secondaryAction(modal.index),
      }}
      children={
        <Content condition={modal.condition} handleUpdate={handleUpdate} />
      }
    />
  );
}
