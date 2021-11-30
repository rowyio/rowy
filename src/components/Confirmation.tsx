import React, { useState } from "react";

import { makeStyles, createStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { SlideTransitionMui } from "@src/components/Modal/SlideTransition";

const useStyles = makeStyles(() =>
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
    color?: "error";
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

      <Dialog
        open={showDialog}
        onClose={handleClose}
        TransitionComponent={SlideTransitionMui}
        maxWidth="xs"
      >
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
          <Button onClick={handleClose}>
            {(message && message.cancel) || "Cancel"}
          </Button>
          <Button
            onClick={() => {
              confirmHandler();
              handleClose();
            }}
            variant="contained"
            color={message?.color || "primary"}
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
