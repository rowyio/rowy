import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import { Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FieldType } from "constants/fields";
import FieldsDropdown from "./FieldsDropdown";

export default function FormDialog({
  name,
  fieldName,
  type,
  open,
  handleClose,
  handleSave,
}: {
  name: string;
  fieldName: string;
  type: FieldType;
  open: boolean;
  handleClose: Function;
  handleSave: Function;
}) {
  const [newType, setType] = useState(type);
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
            <Typography variant="h6">Change Column Type</Typography>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography variant="overline">Current Column: {name}</Typography>

          <FieldsDropdown
            value={newType}
            onChange={(newType: any) => {
              setType(newType.target.value);
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
              handleSave(fieldName, { type: newType });
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
