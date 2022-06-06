import { useAtom, useSetAtom } from "jotai";
import { get } from "lodash-es";

import Cut from "@mui/icons-material/ContentCut";
import { CopyCells } from "@src/assets/icons";
import Paste from "@mui/icons-material/ContentPaste";

import {
  tableScope,
  tableColumnsOrderedAtom,
  tableRowsAtom,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { useSnackbar } from "notistack";
// import { SelectedCell } from "@src/atoms/ContextMenu";
import { getFieldProp, getFieldType } from "@src/components/fields";

export interface IContextMenuActions {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function BasicContextMenuActions(
  selectedCell: any,
  reset: () => void | Promise<void>
): IContextMenuActions[] {
  const { enqueueSnackbar } = useSnackbar();

  // TODO: Remove these useAtom calls that cause re-render
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const selectedCol = tableColumnsOrdered[selectedCell?.colIndex];
  if (!selectedCol) return [];

  const selectedRow = tableRows[selectedCell.rowIndex];
  const cellValue = get(selectedRow, selectedCol.key);

  const handleClose = async () => await reset?.();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cellValue);
      enqueueSnackbar("Copied");
    } catch (error) {
      enqueueSnackbar(`Failed to copy:${error}`, { variant: "error" });
    }
    handleClose();
  };

  const handleCut = async () => {
    try {
      await navigator.clipboard.writeText(cellValue);
      if (typeof cellValue !== "undefined")
        updateField({
          path: selectedRow._rowy_ref.path,
          fieldName: selectedCol.fieldName,
          value: undefined,
          deleteField: true,
        });
    } catch (error) {
      enqueueSnackbar(`Failed to cut: ${error}`, { variant: "error" });
    }
    handleClose();
  };

  const handlePaste = async () => {
    try {
      if (!selectedCol) return;
      const text = await navigator.clipboard.readText();
      const cellDataType = getFieldProp("dataType", getFieldType(selectedCol));
      let parsed;
      switch (cellDataType) {
        case "number":
          parsed = Number(text);
          if (isNaN(parsed)) throw new Error(`${text} is not a number`);
          break;
        case "string":
          parsed = text;
          break;
        default:
          parsed = JSON.parse(text);
          break;
      }
      updateField({
        path: selectedRow._rowy_ref.path,
        fieldName: selectedCol.fieldName,
        value: parsed,
      });
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
