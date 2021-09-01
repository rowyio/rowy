import { useState } from "react";
import { IMenuModalProps } from ".";

import { TextField } from "@material-ui/core";

import Modal from "components/Modal";

export default function NameChange({
  name,
  fieldName,
  open,
  handleClose,
  handleSave,
}: IMenuModalProps) {
  const [newName, setName] = useState(name);

  if (!open) return null;

  return (
    <Modal
      onClose={handleClose}
      title="Rename Column"
      maxWidth="xs"
      children={
        <TextField
          value={newName}
          autoFocus
          variant="filled"
          id="name"
          label="Column Name"
          type="text"
          fullWidth
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      }
      actions={{
        primary: {
          onClick: () => {
            handleSave(fieldName, { name: newName });
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
