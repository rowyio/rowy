import { memo } from "react";
import { useAtom, useSetAtom } from "jotai";
import type { IRenderedTableCellProps } from "@src/components/Table/TableCell/withRenderTableCell";

import { Stack, Tooltip, IconButton, alpha } from "@mui/material";
import { CopyCells as CopyCellsIcon } from "@src/assets/icons";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MenuIcon from "@mui/icons-material/MoreHoriz";

import {
  projectScope,
  userRolesAtom,
  altPressAtom,
  confirmDialogAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  addRowAtom,
  deleteRowAtom,
  contextMenuTargetAtom,
  _updateRowDbAtom,
  tableSchemaAtom,
} from "@src/atoms/tableScope";
export const FinalColumn = memo(function FinalColumn({
  row,
  focusInsideCell,
}: IRenderedTableCellProps) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [updateRowDb] = useAtom(_updateRowDbAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);

  const addRow = useSetAtom(addRowAtom, tableScope);
  const deleteRow = useSetAtom(deleteRowAtom, tableScope);
  const setContextMenuTarget = useSetAtom(contextMenuTargetAtom, tableScope);

  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [altPress] = useAtom(altPressAtom, projectScope);

  const handleDelete = () => {
    const _delete = () =>
      deleteRow({
        path: row.original._rowy_ref.path,
        options: row.original._rowy_ref.arrayTableData,
      });
    if (altPress || row.original._rowy_ref.arrayTableData !== undefined) {
      _delete();
    } else {
      confirm({
        title: "Delete row?",
        body: (
          <>
            Row path:
            <br />
            <code style={{ userSelect: "all", wordBreak: "break-all" }}>
              {row.original._rowy_ref.path}
            </code>
          </>
        ),
        confirm: "Delete",
        confirmColor: "error",
        handleConfirm: _delete,
      });
    }
  };

  const addRowIdType = tableSchema.idType || "decrement";

  const handleDuplicate = () => {
    const _duplicate = () => {
      if (row.original._rowy_ref.arrayTableData !== undefined) {
        if (!updateRowDb) return;

        return updateRowDb("", {}, undefined, {
          index: row.original._rowy_ref.arrayTableData.index,
          operation: {
            addRow: "bottom",
            base: row.original,
          },
        });
      }
      return addRow({
        row: row.original,
        setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
      });
    };
    if (altPress || row.original._rowy_ref.arrayTableData !== undefined) {
      _duplicate();
    } else {
      confirm({
        title: "Duplicate row?",
        body: (
          <>
            Row path:
            <br />
            <code style={{ userSelect: "all", wordBreak: "break-all" }}>
              {row.original._rowy_ref.path}
            </code>
          </>
        ),
        confirm: "Duplicate",
        handleConfirm: _duplicate,
      });
    }
  };

  if (!userRoles.includes("ADMIN") && tableSettings.readOnly === true)
    return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      className="cell-contents"
      gap={0.5}
    >
      <Tooltip title="Row menu">
        <IconButton
          size="small"
          color="inherit"
          onClick={(e) => {
            setContextMenuTarget(e.target as HTMLElement);
          }}
          className="row-hover-iconButton"
          tabIndex={focusInsideCell ? 0 : -1}
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Duplicate row">
        <IconButton
          size="small"
          color="inherit"
          disabled={tableSettings.tableType === "collectionGroup"}
          onClick={handleDuplicate}
          className="row-hover-iconButton"
          tabIndex={focusInsideCell ? 0 : -1}
        >
          <CopyCellsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={`Delete row${altPress ? "" : "…"}`}>
        <IconButton
          size="small"
          color="inherit"
          onClick={handleDelete}
          className="row-hover-iconButton"
          tabIndex={focusInsideCell ? 0 : -1}
          sx={{
            "[role='row']:hover .row-hover-iconButton&&, .row-hover-iconButton&&:focus":
              {
                color: "error.main",
                backgroundColor: (theme) =>
                  alpha(
                    theme.palette.error.main,
                    theme.palette.action.hoverOpacity * 2
                  ),
              },
          }}
          disabled={!row.original._rowy_ref.path}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
});
export default FinalColumn;
