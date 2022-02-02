import _find from "lodash/find";
import { getFieldProp } from "@src/components/fields";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useContextMenuAtom from "@src/hooks/useContextMenuAtom";
import { MenuContents } from "./MenuContent";

export default function ContextMenu() {
  const { tableState }: any = useProjectContext();
  const { contextMenu, resetContextMenu } = useContextMenuAtom();
  const { anchorEl, selectedCell } = contextMenu;
  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedCol = _find(columns, { index: selectedColIndex });
  const configActions =
    getFieldProp("contextMenuActions", selectedCol?.type) ||
    function empty() {};
  const actions = configActions(selectedCell, resetContextMenu) || [];
  const hasNoActions = Boolean(actions.length === 0);

  if (!contextMenu || hasNoActions) return <></>;
  return (
    <MenuContents
      anchorEl={anchorEl as HTMLElement}
      open={Boolean(contextMenu.anchorEl)}
      handleClose={resetContextMenu}
      items={actions}
    />
  );
}
