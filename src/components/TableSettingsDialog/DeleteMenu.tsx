import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import {
  IconButton,
  Menu,
  MenuItem,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import {
  projectScope,
  confirmDialogAtom,
  updateTableAtom,
  deleteTableAtom,
} from "@src/atoms/projectScope";
import { TableSettings } from "@src/types/table";
import { ROUTES } from "@src/constants/routes";
import { analytics, logEvent } from "@src/analytics";

export interface IDeleteMenuProps {
  clearDialog: () => void;
  data: TableSettings | null;
}

export default function DeleteMenu({ clearDialog, data }: IDeleteMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  const navigate = useNavigate();
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [updateTable] = useAtom(updateTableAtom, projectScope);
  const handleResetStructure = async () => {
    const snack = enqueueSnackbar("Resetting columns…", { persist: true });
    await updateTable!(
      { id: data!.id, tableType: data!.tableType },
      { _schema: { columns: {} } }
    );
    clearDialog();
    closeSnackbar(snack);
    enqueueSnackbar("Columns reset");
  };

  const [deleteTable] = useAtom(deleteTableAtom, projectScope);
  const handleDelete = async () => {
    const snack = enqueueSnackbar("Deleting table…", { persist: true });
    await deleteTable!(data!.id);
    logEvent(analytics, "delete_table");
    clearDialog();
    closeSnackbar(snack);
    navigate(ROUTES.home);
    enqueueSnackbar("Deleted table");
  };

  return (
    <>
      <Tooltip title="Delete menu">
        <IconButton
          aria-label="Delete table…"
          id="table-settings-delete-button"
          aria-controls="table-settings-delete-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="table-settings-delete-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "table-settings-delete-button" }}
        disablePortal
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          color="error"
          onClick={() =>
            confirm({
              title: `Reset columns of “${data?.name}”?`,
              body: (
                <>
                  <DialogContentText paragraph>
                    This will only reset the columns of this column so you can
                    set up the columns again.
                  </DialogContentText>
                  <DialogContentText>
                    You will not lose any data in your Firestore collection{" "}
                    <code>{data?.collection}</code>.
                  </DialogContentText>
                </>
              ),
              confirm: "Reset",
              confirmColor: "error",
              handleConfirm: handleResetStructure,
            })
          }
          disabled={!updateTable}
        >
          Reset columns…
        </MenuItem>

        <MenuItem
          color="error"
          onClick={() =>
            confirm({
              title: `Delete the table “${data?.name}”?`,
              body: (
                <>
                  <DialogContentText paragraph>
                    This will only delete the Rowy configuration data.
                  </DialogContentText>
                  <DialogContentText>
                    You will not lose any data in your Firestore collection{" "}
                    <code>{data?.collection}</code>.
                  </DialogContentText>
                </>
              ),
              confirm: "Delete",
              confirmColor: "error",
              handleConfirm: handleDelete,
            })
          }
          disabled={!deleteTable}
        >
          Delete table…
        </MenuItem>
      </Menu>
    </>
  );
}
