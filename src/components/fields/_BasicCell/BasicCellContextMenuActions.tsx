import _find from "lodash/find";
import CopyCells from "@src/assets/icons/CopyCells";
import Cut from "@src/assets/icons/Cut";
import Paste from "@src/assets/icons/Paste";
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

  const handleClose = () => reset?.();

  const handleCopy = () => {
    const cell = selectedRow?.[selectedCol.key];
    const onFail = () =>
      enqueueSnackbar("Failed to copy", { variant: "error" });
    const onSuccess = () =>
      enqueueSnackbar("Copied to clipboard", { variant: "success" });
    const copy = navigator.clipboard.writeText(JSON.stringify(cell));
    copy.then(onSuccess, onFail);

    handleClose();
  };

  const handleCut = () => {
    const cell = selectedRow?.[selectedCol.key];
    const notUndefined = Boolean(typeof cell !== "undefined");
    if (deleteCell && notUndefined)
      deleteCell(selectedRow?.ref, selectedCol?.key);

    handleClose();
  };

  const handlePaste = () => {
    const paste = navigator.clipboard.readText();
    paste.then(async (clipText) => {
      try {
        const paste = await JSON.parse(clipText);
        updateCell?.(selectedRow?.ref, selectedCol.key, paste);
      } catch (error) {
        enqueueSnackbar(`${error}`, { variant: "error" });
      }
    });

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
