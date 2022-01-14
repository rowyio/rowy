import { useState } from "react";
import { useHistory } from "react-router-dom";

import { IconButton, Menu, MenuItem, DialogContentText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import Confirmation from "@src/components/Confirmation";

import { Table } from "@src/contexts/ProjectContext";
import { routes } from "@src/constants/routes";
import { db } from "@src/firebase";
import { name } from "@root/package.json";
import {
  SETTINGS,
  TABLE_SCHEMAS,
  TABLE_GROUP_SCHEMAS,
} from "@src/config/dbPaths";

export interface IDeleteMenuProps {
  clearDialog: () => void;
  data: Table | null;
}

export default function DeleteMenu({ clearDialog, data }: IDeleteMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);

  const history = useHistory();

  const handleResetStructure = async () => {
    const schemaDocRef = db.doc(`${TABLE_SCHEMAS}/${data!.id}`);
    await schemaDocRef.update({ columns: {} });
    clearDialog();
  };

  const handleDelete = async () => {
    const tablesDocRef = db.doc(SETTINGS);
    const tableData = (await tablesDocRef.get()).data();
    const updatedTables = tableData?.tables.filter(
      (table) => table.id !== data?.id || table.tableType !== data?.tableType
    );
    tablesDocRef.update({ tables: updatedTables });
    db.collection(
      data?.tableType === "primaryCollection"
        ? TABLE_SCHEMAS
        : TABLE_GROUP_SCHEMAS
    )
      .doc(data?.id)
      .delete();
    clearDialog();
    history.push(routes.home);
  };

  return (
    <>
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
        <Confirmation
          message={{
            title: `Reset columns of “${data?.name}”?`,
            body: (
              <>
                <DialogContentText paragraph>
                  This will only reset the columns of this column so you can set
                  up the columns again.
                </DialogContentText>
                <DialogContentText>
                  You will not lose any data in your Firestore collection{" "}
                  <code>{data?.collection}</code>.
                </DialogContentText>
              </>
            ),
            confirm: "Reset",
            color: "error",
          }}
          functionName="onClick"
        >
          <MenuItem onClick={handleResetStructure} color="error">
            Reset columns…
          </MenuItem>
        </Confirmation>

        <Confirmation
          message={{
            title: `Delete the table “${data?.name}”?`,
            body: (
              <>
                <DialogContentText paragraph>
                  This will only delete the {name} configuration data.
                </DialogContentText>
                <DialogContentText>
                  You will not lose any data in your Firestore collection{" "}
                  <code>{data?.collection}</code>.
                </DialogContentText>
              </>
            ),
            confirm: "Delete",
            color: "error",
          }}
          functionName="onClick"
        >
          <MenuItem color="error" onClick={handleDelete}>
            Delete table…
          </MenuItem>
        </Confirmation>
      </Menu>
    </>
  );
}
