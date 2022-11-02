import { useAtom, useSetAtom } from "jotai";
import type { FormatterProps } from "react-data-grid";

import { Stack, Tooltip, IconButton, alpha } from "@mui/material";
import { CopyCells as CopyCellsIcon } from "@src/assets/icons";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  projectScope,
  userRolesAtom,
  tableAddRowIdTypeAtom,
  altPressAtom,
  confirmDialogAtom,
} from "@src/atoms/projectScope";
import {
  tableScope,
  tableSettingsAtom,
  addRowAtom,
  deleteRowAtom,
} from "@src/atoms/tableScope";
import { TableRow } from "@src/types/table";

export default function FinalColumn({ row }: FormatterProps<TableRow, any>) {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [addRowIdType] = useAtom(tableAddRowIdTypeAtom, projectScope);
  const confirm = useSetAtom(confirmDialogAtom, projectScope);

  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const addRow = useSetAtom(addRowAtom, tableScope);
  const deleteRow = useSetAtom(deleteRowAtom, tableScope);

  const [altPress] = useAtom(altPressAtom, projectScope);
  const handleDelete = () => deleteRow(row._rowy_ref.path);
  const handleDuplicate = () => {
    addRow({
      row,
      setId: addRowIdType === "custom" ? "decrement" : addRowIdType,
    });
  };

  if (!userRoles.includes("ADMIN") && tableSettings.readOnly === true)
    return null;

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="Duplicate row">
        <IconButton
          size="small"
          color="inherit"
          disabled={tableSettings.tableType === "collectionGroup"}
          onClick={
            altPress
              ? handleDuplicate
              : () => {
                  confirm({
                    title: "Duplicate row?",
                    body: (
                      <>
                        Row path:
                        <br />
                        <code
                          style={{ userSelect: "all", wordBreak: "break-all" }}
                        >
                          {row._rowy_ref.path}
                        </code>
                      </>
                    ),
                    confirm: "Duplicate",
                    handleConfirm: handleDuplicate,
                  });
                }
          }
          aria-label="Duplicate row"
          className="row-hover-iconButton"
        >
          <CopyCellsIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={`Delete row${altPress ? "" : "…"}`}>
        <IconButton
          size="small"
          color="inherit"
          onClick={
            altPress
              ? handleDelete
              : () => {
                  confirm({
                    title: "Delete row?",
                    body: (
                      <>
                        Row path:
                        <br />
                        <code
                          style={{ userSelect: "all", wordBreak: "break-all" }}
                        >
                          {row._rowy_ref.path}
                        </code>
                      </>
                    ),
                    confirm: "Delete",
                    confirmColor: "error",
                    handleConfirm: handleDelete,
                  });
                }
          }
          aria-label={`Delete row${altPress ? "" : "…"}`}
          className="row-hover-iconButton"
          sx={{
            ".rdg-row:hover .row-hover-iconButton&&": {
              color: "error.main",
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.error.main,
                  theme.palette.action.hoverOpacity * 2
                ),
            },
          }}
          disabled={!row._rowy_ref.path}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
