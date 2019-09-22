import React, { useState, useEffect } from "react";
import _camelCase from "lodash/camelCase";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

export default function ColumnDialog(props: any) {
  const { classes, columnName, updateColumn } = props;
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  function handleUpdate() {
    // updateColumn(tableName, collectionName);
    handleClose();
  }

  return (
    <div>
      <Fab
        className={classes.fabButton}
        color="secondary"
        aria-label="add"
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
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
              // setTableName(e.target.value);
            }}
            margin="dense"
            id="name"
            label="Table Name"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
