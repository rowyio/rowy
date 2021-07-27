import { useState } from "react";

import { IMenuModalProps } from ".";
import Modal from "components/Modal";
import FieldsDropdown from "./FieldsDropdown";

export default function FormDialog({
  fieldName,
  type,
  open,
  handleClose,
  handleSave,
}: IMenuModalProps) {
  const [newType, setType] = useState(type);

  if (!open) return null;

  return (
    <Modal
      onClose={handleClose}
      title="Change Column Type"
      children={
        <FieldsDropdown
          value={newType}
          onChange={(newType: any) => {
            setType(newType.target.value);
          }}
        />
      }
      actions={{
        primary: {
          onClick: () => {
            handleSave(fieldName, { type: newType });
            handleClose();
          },
          children: "Update",
        },
        secondary: {
          onClick: handleClose,
          children: "Cancel",
        },
      }}
    />
  );
}
