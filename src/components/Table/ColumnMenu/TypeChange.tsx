import { useState } from "react";

import { IMenuModalProps } from ".";
import Modal from "@src/components/Modal";
import FieldsDropdown from "./FieldsDropdown";
import { analytics } from "analytics";
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
      title="Change column type"
      children={<FieldsDropdown value={newType} onChange={setType} />}
      actions={{
        primary: {
          onClick: () => {
            handleSave(fieldName, { type: newType });
            handleClose();
            analytics.logEvent("change_column_type", {
              newType,
              prevType: type,
            });
          },
          children: "Update",
        },
      }}
      maxWidth="xs"
    />
  );
}
