import _find from "lodash/find";
import { getColumnType, getFieldProp } from "@src/components/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { MenuContents } from "./MenuContent";
import { useContextMenuAtom } from "@src/atoms/ContextMenu";

export default function ContextMenu() {
  const { tableState } = useProjectContext();
  const { anchorEle, selectedCell, resetContextMenu } = useContextMenuAtom();
  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedColumn = _find(columns, { index: selectedColIndex });
  if (!selectedColumn) return <></>;
  const configActions =
    getFieldProp("contextMenuActions", getColumnType(selectedColumn)) ||
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
