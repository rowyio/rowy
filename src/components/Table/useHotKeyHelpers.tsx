import _get from "lodash/get";
import _find from "lodash/find";
import { useSnackbar } from "notistack";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { getColumnType, getFieldProp } from "@src/components/fields";

export default function useHotKeyHelpers(selectedCell) {
  const { enqueueSnackbar } = useSnackbar();
  const { tableState, deleteCell, updateCell } = useProjectContext();

  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });

  const rows = tableState?.rows;
  const selectedRowIndex = selectedCell?.rowIndex as number;
  const selectedRow = rows?.[selectedRowIndex];

  const cellValue = _get(selectedRow, selectedCol?.key);

  async function handleCopy() {
    if (!selectedCell) return null;
    try {
      await navigator.clipboard.writeText(cellValue);
      enqueueSnackbar(`Copied to clipboard`, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Failed to copy:${error}`, { variant: "error" });
    }
  }

  async function handleCut() {
    if (!selectedCell) return;
    try {
      await navigator.clipboard.writeText(cellValue);
      if (typeof cellValue !== "undefined")
        deleteCell?.(selectedRow?.ref, selectedCol?.key);
    } catch (error) {
      enqueueSnackbar(`Failed to cut: ${error}`, { variant: "error" });
    }
  }

  async function handlePaste() {
    if (!selectedCell) return;
    try {
      const text = await navigator.clipboard.readText();
      const cellDataType = getFieldProp("dataType", getColumnType(selectedCol));
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
      updateCell?.(selectedRow?.ref, selectedCol.key, parsed);
    } catch (error) {
      enqueueSnackbar(`Failed to paste: ${error}`, { variant: "error" });
    }
  }
  return {
    handleCopy,
    handleCut,
    handlePaste,
  };
}
