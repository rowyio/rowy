import { useAtom, useSetAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";
import { Copy } from "@src/assets/icons";
import Paste from "@mui/icons-material/ContentPaste";

import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
  updateFieldAtom,
} from "@src/atoms/tableScope";
import { IFieldConfig } from "@src/components/fields/types";

export interface IContextMenuActions {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const ContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
  reset
) => {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const { enqueueSnackbar } = useSnackbar();
  const updateField = useSetAtom(updateFieldAtom, tableScope);
  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) return [];

  const selectedRow = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  const cellValue = get(selectedRow, selectedCol.fieldName) || [];

  const isEmpty =
    cellValue === "" ||
    cellValue === null ||
    cellValue === undefined ||
    cellValue.length === 0;

  return [
    {
      label: "Copy",
      icon: <Copy />,
      onClick: () => {
        try {
          navigator.clipboard.writeText(JSON.stringify(cellValue));
          enqueueSnackbar("Copied");
        } catch (error) {
          enqueueSnackbar(`Failed to copy: ${error}`, { variant: "error" });
        }
      },
      disabled: isEmpty,
    },
    {
      label: "Paste",
      icon: <Paste />,
      onClick: async () => {
        try {
          const text = await navigator.clipboard.readText();
          const parsed = JSON.parse(text);
          updateField({
            path: selectedCell.path,
            fieldName: selectedCol.fieldName,
            value: parsed,
          });
        } catch (error) {
          enqueueSnackbar(`Failed to paste: ${error}`, { variant: "error" });
        }
      },
    },
  ];
};

export default ContextMenuActions;
