import _find from "lodash/find";

import Cut from "@mui/icons-material/ContentCut";
import CopyCells from "@src/assets/icons/CopyCells";
import Paste from "@mui/icons-material/ContentPaste";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useSnackbar } from "notistack";
import { SelectedCell } from "@src/atoms/ContextMenu";

export interface IContextMenuActions {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function BasicContextMenuActions(
  selectedCell: SelectedCell,
  reset: () => void | Promise<void>
): IContextMenuActions[] {
  const { tableState, deleteCell, updateCell } = useProjectContext();
  const { enqueueSnackbar } = useSnackbar();
  const columns = tableState?.columns;
  const rows = tableState?.rows;
  const selectedRowIndex = selectedCell.rowIndex as number;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });
  const selectedRow = rows?.[selectedRowIndex];
  const cell = selectedRow?.[selectedCol.key];

  const handleClose = async () => await reset?.();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cell));
      enqueueSnackbar("Copied to clipboard", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to copy", { variant: "error" });
    }
    handleClose();
  };

  const handleCut = () => {
    const notUndefined = Boolean(typeof cell !== "undefined");
    if (deleteCell && notUndefined)
      deleteCell(selectedRow?.ref, selectedCol?.key);
    handleClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const paste = await JSON.parse(text);
      updateCell?.(selectedRow?.ref, selectedCol.key, paste);
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: "error" });
    }

    handleClose();
  };

  // const handleDisable = () => {
  //     const cell = selectedRow?.[selectedCol.key];
  //     return typeof cell === "undefined" ? true : false;
  // };

  const contextMenuActions = [
    { label: "Cut", icon: <Cut />, onClick: handleCut },
    { label: "Copy", icon: <CopyCells />, onClick: handleCopy },
    { label: "Paste", icon: <Paste />, onClick: handlePaste },
  ];

  return contextMenuActions;
}
