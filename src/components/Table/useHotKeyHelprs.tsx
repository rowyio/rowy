import { useContextMenuAtom } from "@src/atoms/ContextMenu";
import _get from "lodash/get";
import _find from "lodash/find";
import { useSnackbar } from "notistack";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { getColumnType, getFieldProp } from "@src/components/fields";

export default function useHotKeyHelpers() {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedCell } = useContextMenuAtom();
  const { tableState, deleteCell, updateCell } = useProjectContext();

  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });

  const rows = tableState?.rows;
  const selectedRowIndex = selectedCell?.rowIndex as number;
  const selectedRow = rows?.[selectedRowIndex];

  const cellValue = _get(selectedRow, selectedCol?.key);

  console.log("what is cell", selectedCell);
  async function handleCopy() {
    console.log("copy firing", selectedCell);
    if (!selectedCell) return null;
    try {
      await navigator.clipboard.writeText(cellValue);
      enqueueSnackbar(`Copied to clipboard${cellValue}`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`Failed to copy:${error}`, { variant: "error" });
    }
  }

  async function handleCut() {
    console.log("handle cut firing", selectedCell);
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
    console.log("handle paste firing", selectedCell);
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

  return { handleCopy, handlePaste, handleCut };
}
