import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import AddIcon from "@material-ui/icons/Add";
import useRouter from "../hooks/useRouter";

import {
  Tooltip,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@material-ui/core";

export interface ICreateTableDialogProps {
  /** Optional class overrides */
  classes?: Partial<Record<"fab", string>>;
  /** Function to handle table creation */
  createTable: (tableName: string, collectionName: string) => void;
}

export default function CreateTableDialog({
  classes = {},
  createTable,
}: ICreateTableDialogProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [tableName, setTableName] = useState("");
  const [collectionName, setCollectionName] = useState("");
  useEffect(() => {
    setCollectionName(_camelCase(tableName));
  }, [tableName]);
  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setTableName("");
    setCollectionName("");
    setOpen(false);
  }
  function handleCreate() {
    createTable(tableName, collectionName);
    if (router.location.pathname === "/") {
      router.history.push(`table/${collectionName}`);
    } else {
      router.history.push(collectionName);
    }

    handleClose();
  }

  return (
    <div>
      <Tooltip title="Create a table">
        <Fab
          className={classes.fab}
          color="secondary"
          aria-label="Create table"
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New table</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new Table</DialogContentText>
          <TextField
            autoFocus
            onChange={e => {
              setTableName(e.target.value);
            }}
            margin="dense"
            id="name"
            label="Table Name"
            type="email"
            fullWidth
          />
          <TextField
            value={collectionName}
            onChange={e => {
              setCollectionName(e.target.value);
            }}
            margin="dense"
            id="collection"
            label="Collection Name"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
