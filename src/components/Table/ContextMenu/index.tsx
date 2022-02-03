import _find from "lodash/find";
import { getFieldProp } from "@src/components/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { MenuContents } from "./MenuContent";
import { useContextMenuAtom, useSetSelectedCell } from "@src/atoms/ContextMenu";

export default function ContextMenu() {
  const { tableState }: any = useProjectContext();
  const { anchorEle, selectedCell, resetContextMenu }: any =
    useContextMenuAtom();
  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
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
