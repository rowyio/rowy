import React from "react";
import _find from "lodash/find";
import { PopoverProps } from "@mui/material";

import { getFieldProp } from "@src/components/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";

import { MenuContents } from "./MenuContent";

export type SelectedCell = {
  rowIndex: number;
  colIndex: number;
};

export type ContextMenuRef = {
  selectedCell: SelectedCell;
  setSelectedCell: React.Dispatch<React.SetStateAction<SelectedCell | null>>;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<
    React.SetStateAction<PopoverProps["anchorEl"] | null>
  >;
};

export default function ContextMenu() {
  const { contextMenuRef, tableState }: any = useProjectContext();
  const [anchorEl, setAnchorEl] = React.useState<any | null>(null);
  const [selectedCell, setSelectedCell] = React.useState<any | null>();
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  if (contextMenuRef)
    contextMenuRef.current = {
      anchorEl,
      setAnchorEl,
      selectedCell,
      setSelectedCell,
    } as {};

  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(tableState?.columns, { index: selectedColIndex });
  const getActions =
    getFieldProp("contextMenuActions", selectedCol?.type) ||
    function empty() {};
  const actions = getActions() || [];
  const hasNoActions = Boolean(actions.length === 0);

  if (!contextMenuRef.current || !open || hasNoActions) return <></>;
  return (
    <MenuContents
      anchorEl={anchorEl}
      open={open}
      handleClose={handleClose}
      items={actions}
    />
  );
}
