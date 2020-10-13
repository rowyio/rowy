import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    dryWrapper: {},
    dryField: {},
  })
);

export interface IConfirmationProps {
  children: JSX.Element;
  message?: {
    title?: string;
    customBody?: string;
    body?: string;
    cancel?: string;
    confirm?: string | JSX.Element;
  };
  confirmationCommand?: string;
  handleConfirm: Function;
  handleClose: any;
  stopPropagation?: boolean;
  open: boolean;
}

export default function Confirmation({
  message,
  confirmationCommand,
  handleConfirm,
  handleClose,
  stopPropagation = false,
  open,
}: IConfirmationProps) {
  const classes = useStyles();
  const [dryText, setDryText] = useState("");
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {(message && message.title) || "Are you sure?"}
        </DialogTitle>
        {message && (
          <DialogContent>
            {message.customBody}
            {message.body && (
              <DialogContentText>{message.body}</DialogContentText>
            )}
            {confirmationCommand && (
              <div className={classes.dryWrapper}>
                <DialogContentText>
                  Type {confirmationCommand} below to continue:
                </DialogContentText>
                <TextField
                  value={dryText}
                  variant="filled"
                  onChange={(e) => {
                    setDryText(e.target.value);
                  }}
                  className={classes.dryField}
                  InputProps={{ disableUnderline: true }}
                  autoFocus
                  margin="dense"
                  label={confirmationCommand}
                  fullWidth
                />
              </div>
            )}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {(message && message.cancel) || "Cancel"}
          </Button>
          <Button
            onClick={() => {
              handleConfirm();
              handleClose();
            }}
            color="primary"
            variant="contained"
            autoFocus
            disabled={
              confirmationCommand ? dryText !== confirmationCommand : false
            }
          >
            {(message && message.confirm) || "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
