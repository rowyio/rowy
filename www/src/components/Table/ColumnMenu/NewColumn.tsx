import React, { useState, useEffect } from "react";
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
import _camel from "lodash/camelCase";

export default function FormDialog({
  open,
  data,
  handleClose,
  handleSave,
}: {
  open: boolean;
  data: any;
  handleClose: Function;
  handleSave: Function;
}) {
  const [type, setType] = useState(FieldType.shortText);
  const [columnLabel, setColumnLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  useEffect(() => {
    setFieldKey(_camel(columnLabel));
  }, [columnLabel]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={(e, r) => {
          handleClose();
        }}
        aria-labelledby="new-column"
      >
        <DialogContent>
          <Grid
            container
            justify="space-between"
            alignContent="flex-start"
            direction="row"
          >
            <Typography variant="h6">Add new column</Typography>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Typography variant="overline">Column Name</Typography>
          <TextField
            value={columnLabel}
            autoFocus
            variant="filled"
            id="columnName"
            label="Column Header"
            type="text"
            fullWidth
            onChange={e => {
              setColumnLabel(e.target.value);
            }}
          />
          <Typography variant="overline">Field Key</Typography>
          <TextField
            value={fieldKey}
            variant="filled"
            id="fieldKey"
            label="Field Key"
            type="text"
            fullWidth
            onChange={e => {
              setFieldKey(e.target.value);
            }}
          />
          <Typography variant="overline">Column Type</Typography>

          <FieldsDropdown
            value={type}
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
              //const fieldName = _camel(name);
              handleSave(fieldKey, {
                type,
                name: columnLabel,
                fieldName: fieldKey,
                key: fieldKey,
                config: {},
                ...data.initializeColumn,
              });
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
