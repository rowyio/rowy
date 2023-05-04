import { Copy as CopyCells } from "@src/assets/icons";
// import Cut from "@mui/icons-material/ContentCut";
import Paste from "@mui/icons-material/ContentPaste";
import { IFieldConfig } from "@src/components/fields/types";
import { useMenuAction } from "@src/components/Table/useMenuAction";
import { useAtom } from "jotai";
import { tableSchemaAtom, tableScope } from "@src/atoms/tableScope";

import { SUPPORTED_TYPES_PASTE } from "@src/components/Table/useMenuAction";

// TODO: Remove this and add `handlePaste` function to column config
export const BasicContextMenuActions: IFieldConfig["contextMenuActions"] = (
  selectedCell,
  reset
) => {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const selectedCol = tableSchema.columns?.[selectedCell.columnKey];

  const handleClose = async () => await reset?.();
  const { handleCopy, handlePaste, cellValue } = useMenuAction(
    selectedCell,
    handleClose
  );

  const contextMenuActions = [
    // { label: "Cut", icon: <Cut />, onClick: handleCut },
    {
      label: "Copy",
      icon: <CopyCells />,
      onClick: handleCopy,
      disabled:
        cellValue === undefined || cellValue === null || cellValue === "",
    },
  ];

  if (SUPPORTED_TYPES_PASTE.has(selectedCol?.type)) {
    contextMenuActions.push({
      label: "Paste",
      icon: <Paste />,
      onClick: handlePaste,
      disabled: false,
    });
  }

  return contextMenuActions;
};

export default BasicContextMenuActions;
