import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import _camelCase from "lodash/camelCase";
import useRouter from "../hooks/useRouter";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";

// TODO: Create an interface for props
export default function CreateTableDialog(props: any) {
  const router = useRouter();
  const { classes, createTable } = props;
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
          className={classes.fabButton}
          color="secondary"
          aria-label="add"
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
