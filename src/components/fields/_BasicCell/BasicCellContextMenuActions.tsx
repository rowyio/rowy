import _find from "lodash/find";

import Cut from "@mui/icons-material/ContentCut";
import CopyCells from "@src/assets/icons/CopyCells";
import Paste from "@mui/icons-material/ContentPaste";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useSnackbar } from "notistack";
import { SelectedCell } from "@src/atoms/ContextMenu";
import { getFieldProp, getColumnType } from "@src/components/fields";

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
      enqueueSnackbar(`Failed to copy:${error}`, { variant: "error" });
    }
    handleClose();
  };

  const handleCut = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cell));
      if (typeof cell !== "undefined")
        deleteCell?.(selectedRow?.ref, selectedCol?.key);
    } catch (error) {
      enqueueSnackbar(`Failed to cut: ${error}`, { variant: "error" });
    }
    handleClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cellDataType = getFieldProp("dataType", getColumnType(selectedCol));
      let parsed;
      if (cellDataType === "number") {
        parsed = Number(text);
        if (isNaN(parsed)) {
          enqueueSnackbar(`Failed to paste: ${text} is not a number`, {
            variant: "error",
          });
          return;
        }
      } else {
        parsed = await JSON.parse(text);
      }
      updateCell?.(selectedRow?.ref, selectedCol.key, parsed);
    } catch (error) {
      enqueueSnackbar(`Failed to paste: ${error}`, { variant: "error" });
    }

    handleClose();
  };

  const contextMenuActions = [
    { label: "Cut", icon: <Cut />, onClick: handleCut },
    { label: "Copy", icon: <CopyCells />, onClick: handleCopy },
    { label: "Paste", icon: <Paste />, onClick: handlePaste },
  ];

  return contextMenuActions;
}
