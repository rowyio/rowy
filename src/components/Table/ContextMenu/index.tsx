import _find from "lodash/find";
import { getFieldProp } from "@src/components/fields";

import MenuContents from "./MenuContent";
import DuplicateIcon from "@src/assets/icons/CopyCells";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import LinkIcon from "@mui/icons-material/Link";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { useContextMenuAtom } from "@src/atoms/ContextMenu";
import { FieldType } from "@src/constants/fields";

import { useAppContext } from "@src/contexts/AppContext";
import { IContextMenuItem } from "./MenuItem";
import { useConfirmation } from "@src/components/ConfirmationDialog/Context";

export default function ContextMenu() {
  const { requestConfirmation } = useConfirmation();
  const { tableState, deleteRow, addRow } = useProjectContext();
  const { userRoles } = useAppContext();

  const { anchorEle, selectedCell, resetContextMenu } = useContextMenuAtom();

  const columns = tableState?.columns;
  const selectedColIndex = selectedCell?.colIndex;
  const selectedColumn = _find(columns, { index: selectedColIndex });

  if (!selectedColumn || !anchorEle) return null;

  const menuActions = getFieldProp("contextMenuActions", selectedColumn.type);
  const actionGroups: IContextMenuItem[][] = [];

  const actions = menuActions
    ? menuActions(selectedCell, resetContextMenu)
    : [];
  if (actions.length > 0) actionGroups.push(actions);

  if (selectedColumn.type === FieldType.derivative) {
    const renderedFieldMenuActions = getFieldProp(
      "contextMenuActions",
      selectedColumn.config.renderFieldType
    );
    if (renderedFieldMenuActions) {
      actionGroups.push(
        renderedFieldMenuActions(selectedCell, resetContextMenu)
      );
    }
  }

  const row = tableState?.rows[selectedCell!.rowIndex];
  if (row) {
    const rowActions = [
      {
        label: "Copy link to row",
        icon: <LinkIcon />,
        onClick: () => {
          const rowRef = encodeURIComponent(row.ref.path);
          navigator.clipboard.writeText(
            window.location.href + `?rowRef=${rowRef}`
          );
        },
      },
      {
        label: "Duplicate row",
        icon: <DuplicateIcon />,
        onClick: () => {
          const { ref, ...clonedRow } = row;
          addRow!(clonedRow, undefined, { type: "smaller" });
          resetContextMenu();
        },
      },
      {
        label: "Delete row…",
        color: "error",
        icon: <DeleteIcon />,
        onClick: () => {
          requestConfirmation({
            title: "Delete row?",
            customBody: (
              <>
                Row path:
                <br />
                <code style={{ userSelect: "all", wordBreak: "break-all" }}>
                  {row.ref.path}
                </code>
              </>
            ),
            confirm: "Delete",
            confirmColor: "error",
            handleConfirm: () => deleteRow?.(row.ref),
          });
          resetContextMenu();
        },
      },
    ];
    actionGroups.push(rowActions);
  }

  return (
    <MenuContents
      anchorEl={anchorEle}
      open={Boolean(anchorEle)}
      handleClose={resetContextMenu}
      groups={actionGroups}
    />
  );
}
