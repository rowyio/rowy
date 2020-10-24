import React, { useState, useEffect } from "react";
import _camel from "lodash/camelCase";

import {
  makeStyles,
  createStyles,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Grid,
  Button,
  TextField,
  DialogActions,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import { FieldType } from "constants/fields";
import FieldsDropdown from "./FieldsDropdown";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { userSelect: "none" },

    closeButton: {
      position: "absolute",
      top: theme.spacing(0.5),
      right: theme.spacing(0.5),
    },

    content: { paddingBottom: theme.spacing(1.5) },

    helperText: {
      ...theme.typography.body2,
      marginTop: theme.spacing(1),
    },

    fieldKey: { fontFamily: theme.typography.fontFamilyMono },
  })
);

export interface IFormDialogProps {
  open: boolean;
  data: any;
  handleClose: () => void;
  handleSave: (fieldKey: string, data: any) => void;
}

export default function FormDialog({
  open,
  data,
  handleClose,
  handleSave,
}: IFormDialogProps) {
  const classes = useStyles();

  const [columnLabel, setColumnLabel] = useState("");
  const [fieldKey, setFieldKey] = useState("");
  const [type, setType] = useState(FieldType.shortText);

  useEffect(() => {
    if (type !== FieldType.id) setFieldKey(_camel(columnLabel));
  }, [columnLabel]);

  useEffect(() => {
    if (type === FieldType.id) {
      setColumnLabel("ID");
      setFieldKey("id");
    }
  }, [type]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="add-new-column"
      fullWidth
      maxWidth="xs"
      className={classes.root}
    >
      <DialogTitle id="add-new-column">Add New Column</DialogTitle>

      <IconButton onClick={handleClose} className={classes.closeButton}>
        <CloseIcon />
      </IconButton>

      <DialogContent className={classes.content}>
        <Grid container spacing={3} direction="column" wrap="nowrap">
          <Grid item>
            <TextField
              value={columnLabel}
              autoFocus
              variant="filled"
              id="columnName"
              label="Column Name"
              type="text"
              fullWidth
              onChange={(e) => setColumnLabel(e.target.value)}
              helperText="Set the user-facing name for this column."
              FormHelperTextProps={{ classes: { root: classes.helperText } }}
            />
          </Grid>

          <Grid item>
            <TextField
              value={fieldKey}
              variant="filled"
              id="fieldKey"
              label="Field Key"
              type="text"
              fullWidth
              onChange={(e) => setFieldKey(e.target.value)}
              disabled={type === FieldType.id && fieldKey === "id"}
              helperText={
                <>
                  Set the Firestore field key to link to this column.
                  <br />
                  It will display any existing data for this field key.
                </>
              }
              FormHelperTextProps={{ classes: { root: classes.helperText } }}
            />
          </Grid>

          <Grid item>
            <FieldsDropdown
              value={type}
              onChange={(newType) => setType(newType.target.value as FieldType)}
            />
          </Grid>
        </Grid>
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
          variant="contained"
          disabled={!columnLabel || !fieldKey || !type}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
