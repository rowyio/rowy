import React, { useState } from "react";

import { IMenuModalProps } from ".";
import StyledModal from "components/StyledModal";
import FieldsDropdown from "./FieldsDropdown";

export default function FormDialog({
  fieldName,
  type,
  open,
  handleClose,
  handleSave,
}: IMenuModalProps) {
  const [newType, setType] = useState(type);

  return (
    <StyledModal
      open={open}
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
          onClick: () => handleSave(fieldName, { type: newType }),
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
