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
    body?: string | React.ReactNode;
    cancel?: string;
    confirm?: string | JSX.Element;
  };
  confirmationCommand?: string;
  functionName?: string;
  stopPropagation?: boolean;
}

export default function Confirmation({
  children,
  message,
  confirmationCommand,
  functionName = "onClick",
  stopPropagation = false,
}: IConfirmationProps) {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [dryText, setDryText] = useState("");

  const handleClose = () => {
    setShowDialog(false);
  };

  const confirmHandler = children.props[functionName];
  const button = React.cloneElement(children, {
    [functionName]: (e) => {
      if (stopPropagation && e && e.stopPropagation) e.stopPropagation();
      setShowDialog(true);
    },
  });

  return (
    <>
      {button}

      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle>
          {(message && message.title) || "Are you sure?"}
        </DialogTitle>
        {message && (
          <DialogContent>
            {message.customBody}
            {message.body &&
              (typeof message.body === "string" ? (
                <DialogContentText>{message.body}</DialogContentText>
              ) : (
                message.body
              ))}
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
              confirmHandler();
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
