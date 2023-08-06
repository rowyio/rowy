import { useEffect, useState } from "react";
import { IColumnModalProps } from ".";
import { selectedCellAtom, tableHeadersAtom } from "@src/atoms/tableScope";
import { tableScope } from "@src/atoms/tableScope";
import { useAtom } from "jotai";

import { TextField } from "@mui/material";
import Modal from "@src/components/Modal";
import { TableRow } from "@src/types/table";
import { Header } from "@tanstack/react-table";

export default function ResizeColumnModal({
  onClose,
  column,
}: IColumnModalProps) {
  const [newWidth, setWidth] = useState<number>(0);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const [tableHeaders] = useAtom(tableHeadersAtom, tableScope);
  const [selectedHeader, setSelectedHeader] = useState<Header<
    TableRow,
    any
  > | null>(null);

  useEffect(() => {
    if (selectedCell && tableHeaders) {
      setSelectedHeader(
        tableHeaders.find((h) => h.id === selectedCell?.columnKey) ?? null
      );
    }
  }, [selectedCell, tableHeaders]);

  useEffect(() => {
    selectedHeader && setWidth(selectedHeader.getSize());
  }, [selectedHeader]);

  return (
    <Modal
      onClose={onClose}
      title="Set Column Width"
      maxWidth="xs"
      children={
        <TextField
          value={newWidth}
          autoFocus
          variant="filled"
          id="name"
          label="Width"
          type="number"
          fullWidth
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      }
      actions={{
        primary: {
          onMouseDown: (e) => {
            selectedHeader &&
              selectedHeader.getResizeHandler()({
                clientX: e.clientX - (newWidth - selectedHeader.getSize()),
              } as any);
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
