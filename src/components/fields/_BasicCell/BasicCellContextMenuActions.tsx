import { useAtom, useSetAtom } from "jotai";
import { useSnackbar } from "notistack";
import { get, find } from "lodash-es";

// import Cut from "@mui/icons-material/ContentCut";
import { CopyCells } from "@src/assets/icons";
import Paste from "@mui/icons-material/ContentPaste";

import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { getFieldProp, getFieldType } from "@src/components/fields";
import { IFieldConfig } from "@src/components/fields/types";

// TODO: Remove this and add `handlePaste` function to column config
export const BasicContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
  reset
) => {
  const { enqueueSnackbar } = useSnackbar();

  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) return [];

  const selectedRow = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  const cellValue = get(selectedRow, selectedCol.fieldName);

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

  // const handleCut = async () => {
  //   try {
  //     await navigator.clipboard.writeText(cellValue);
  //     if (typeof cellValue !== "undefined")
  //       updateField({
  //         path: selectedCell.path,
  //         fieldName: selectedCol.fieldName,
  //         value: undefined,
  //         deleteField: true,
  //       });
  //   } catch (error) {
  //     enqueueSnackbar(`Failed to cut: ${error}`, { variant: "error" });
  //   }
  //   handleClose();
  // };

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
        path: selectedCell.path,
        fieldName: selectedCol.fieldName,
        value: parsed,
      });
    } catch (error) {
      enqueueSnackbar(`Failed to paste: ${error}`, { variant: "error" });
    }

    handleClose();
  };

  const contextMenuActions = [
    // { label: "Cut", icon: <Cut />, onClick: handleCut },
    {
      label: "Copy",
      icon: <CopyCells />,
      onClick: handleCopy,
      disabled:
        cellValue === undefined || cellValue === null || cellValue === "",
    },
    { label: "Paste", icon: <Paste />, onClick: handlePaste },
  ];

  return contextMenuActions;
};

export default BasicContextMenuActions;
