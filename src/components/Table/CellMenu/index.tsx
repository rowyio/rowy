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
  const { cellMenuRef, tableState }: any = useProjectContext();
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

  if (!cellMenuRef.current || !open) return <></>;

  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(tableState?.columns, { index: selectedColIndex });
  const getActions =
    getFieldProp("contextMenuActions", selectedCol?.type) ||
    function empty() {};
  const actions = getActions() ?? [];
  const hasNoActions = Boolean(actions.length === 0);

  console.log(selectedCol?.current?.selectedCell);
  console.log("is Open", open, "has noaction", hasNoActions);
  console.log("tablecolumns", tableState.columns);

  if (!cellMenuRef.current || !open || hasNoActions) return <></>;
  return (
    <MenuContents
      anchorEl={anchorEl}
      open={open}
      handleClose={handleClose}
      items={cellMenuAction}
    />
  );
}
