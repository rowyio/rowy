import { useAtom } from "jotai";
import { find, get } from "lodash-es";
import { useSnackbar } from "notistack";

import { Copy } from "@src/assets/icons";
import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];
  if (!selectedCol) return [];

  const selectedRow = find(tableRows, ["_rowy_ref.path", selectedCell.path]);
  const cellValue = get(selectedRow, selectedCol.fieldName);
  const handleCopyImageURL = () => {
    if (!cellValue || cellValue.length === 0) return;
    navigator.clipboard.writeText(
      cellValue.map((imgObj: RowyFile) => imgObj.downloadURL).join(",")
    );
    enqueueSnackbar("Copied image URL to clipboard", {
      variant: "success",
    });
  };
  const isEmpty =
    cellValue === "" ||
    cellValue === null ||
    cellValue === undefined ||
    cellValue.length === 0;
  const contextMenuActions = isEmpty
    ? []
    : [
        {
          label: "Copy Image URL",
          icon: <Copy />,
          onClick: handleCopyImageURL,
        },
      ];

  return contextMenuActions;
};

export default ContextMenuActions;
