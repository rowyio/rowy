import React from "react";
import { PopoverProps } from "@mui/material";
import CopyCells from "@src/assets/icons/CopyCells";
import Paste from "@src/assets/icons/Paste";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { MenuContents } from "./MenuContent";
import _find from "lodash/find";
import { atom, useAtom } from "jotai";
import PasteFromClipboard from "@src/assets/icons/PasteFromClipboard";

export const cellMenuDataAtom = atom("");

export type SelectedCell = {
  rowIndex: number;
  colIndex: number;
};

export type CellMenuRef = {
  selectedCell: SelectedCell;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell | null>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<
    React.SetStateAction<PopoverProps["anchorEl"] | null>
  >;
};

export default function CellMenu() {
  const { cellMenuRef, tableState, updateCell }: any = useProjectContext();
  const [anchorEl, setAnchorEl] = React.useState<any | null>(null);
  const [selectedCell, setSelectedCell] = React.useState<any | null>();
  const [cellMenuData, setCellMenuData] = useAtom(cellMenuDataAtom);
  const open = Boolean(anchorEl);

  if (cellMenuRef)
    cellMenuRef.current = {
      anchorEl,
      setAnchorEl,
      selectedCell,
      setSelectedCell,
    } as {};

  const handleClose = () => setAnchorEl(null);
  const handleCopy = () => {
    const cols = _find(tableState.columns, { index: selectedCell.colIndex });
    const rows = tableState.rows[selectedCell.rowIndex];
    const cell = rows[cols.key];
    const formatData = typeof cell === "object" ? JSON.stringify(cell) : cell;
    setCellMenuData(formatData);
    const onFail = () => console.log("Fail to copy");
    const onSuccess = () => console.log;

    const copy = navigator.clipboard.writeText(formatData);
    copy.then(onSuccess, onFail);

    handleClose();
  };
  const handlePaste = () => {
    const targetCol = _find(tableState.columns, {
      index: selectedCell.colIndex,
    });
    const targetRow = tableState.rows[selectedCell.rowIndex];
    if (cellMenuData) updateCell(targetRow.ref, targetCol.key, cellMenuData);
    handleClose();
  };

  const handlePasteFromClipboard = () => {
    const paste = navigator.clipboard.readText();
    const targetCol = _find(tableState.columns, {
      index: selectedCell.colIndex,
    });
    const targetRow = tableState.rows[selectedCell.rowIndex];
    paste.then((clipText) =>
      updateCell(targetRow.ref, targetCol.key, clipText)
    );
  };

  const cellMenuAction = [
    { label: "Copy", icon: <CopyCells />, onClick: handleCopy },
    { label: "Paste", icon: <Paste />, onClick: handlePaste },
    {
      label: "Paste from Clipboard",
      icon: <PasteFromClipboard />,
      onClick: handlePasteFromClipboard,
    },
  ];

  if (!cellMenuRef.current || !open) return <></>;
  return (
    <MenuContents
      anchorEl={anchorEl}
      open={open}
      handleClose={handleClose}
      items={cellMenuAction}
    />
  );
}
