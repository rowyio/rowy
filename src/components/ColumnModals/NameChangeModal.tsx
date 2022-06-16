import { useState } from "react";
import { useSetAtom } from "jotai";
import { IColumnModalProps } from ".";

import { TextField } from "@mui/material";
import Modal from "@src/components/Modal";

import { tableScope, updateColumnAtom } from "@src/atoms/tableScope";

export default function NameChangeModal({
  onClose,
  column,
}: IColumnModalProps) {
  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const [newName, setName] = useState(column.name);

  return (
    <Modal
      onClose={onClose}
      title="Rename column"
      maxWidth="xs"
      children={
        <TextField
          value={newName}
          autoFocus
          variant="filled"
          id="name"
          label="Column name"
          type="text"
          fullWidth
          onChange={(e) => setName(e.target.value)}
        />
      }
      actions={{
        primary: {
          onClick: () => {
            updateColumn({ key: column.key, config: { name: newName } });
            onClose();
          },
          children: "Update",
        },
        secondary: {
          onClick: onClose,
          children: "Cancel",
        },
      }}
    />
  );
}
