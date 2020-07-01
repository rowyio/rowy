import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
export default function FormDialog({
  name,
  fieldName,
  open,
  handleClose,
  handleSave,
}: {
  name: string;
  fieldName: string;
  open: boolean;
  handleClose: Function;
  handleSave: Function;
}) {
  const [newName, setName] = useState(name);
  return (
    <div>
      <Dialog
        open={open}
        onClose={(e, r) => {
          handleClose();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Grid
            container
            justify="space-between"
            alignContent="flex-start"
            direction="row"
          >
            <Typography variant="h6">Rename Column</Typography>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography variant="overline">{name}</Typography>
          <TextField
            value={newName}
            autoFocus
            variant="filled"
            id="name"
            label="Column Header"
            type="text"
            fullWidth
            onChange={e => {
              setName(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSave(fieldName, { name: newName });
            }}
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
