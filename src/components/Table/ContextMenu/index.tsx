import _find from "lodash/find";

import { PopoverProps } from "@mui/material";
import { FieldType } from "@src/constants/fields";
import { getFieldProp } from "@src/components/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { MenuContents } from "./MenuContent";
import { useContextMenuAtom, useSetSelectedCell } from "@src/atoms/ContextMenu";

export default function ContextMenu() {
  const { tableState } = useProjectContext();
  const { anchorEle, selectedCell, resetContextMenu } = useContextMenuAtom();
  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(tableState?.columns, { index: selectedColIndex });

  function getColType(col) {
    if (!col) return null;
    return col.type === FieldType.derivative
      ? selectedCol.config.renderFieldType
      : selectedCol.type;
  }

  const columnType = getColType(selectedCol);
  const getActions =
    getFieldProp("contextMenuActions", columnType) || function empty() {};
  const actions = getActions() || [];
  const hasNoActions = Boolean(actions.length === 0);
  
  const selectedCol = _find(columns, { index: selectedColIndex });
  const configActions =
    getFieldProp("contextMenuActions", selectedCol?.type) ||
    function empty() {};
  const actions = configActions(selectedCell, resetContextMenu) || [];
  

  if (!anchorEle || actions.length === 0) return <></>;
  return (
    <MenuContents
      anchorEl={anchorEle}
      open={Boolean(anchorEle)}
      handleClose={resetContextMenu}
      items={actions}
    />
  );
}
