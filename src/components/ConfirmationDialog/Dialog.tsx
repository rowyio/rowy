import { useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@material-ui/core";

import { SlideTransitionMui } from "components/Modal/SlideTransition";

export default function Confirmation({
  title,
  customBody,
  body,
  cancel,
  confirm,
  confirmationCommand,
  handleConfirm,
  open,
  handleClose,
  maxWidth = "xs",
}: any) {
  const [dryText, setDryText] = useState("");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      TransitionComponent={SlideTransitionMui}
      style={{ cursor: "default" }}
    >
      <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>

      <DialogContent>
        {customBody}
        {body && <DialogContentText>{body}</DialogContentText>}
        {confirmationCommand && (
          <div>
            <DialogContentText>
              Type {confirmationCommand} below to continue:
            </DialogContentText>
            <TextField
              value={dryText}
              onChange={(e) => setDryText(e.target.value)}
              autoFocus
              label={confirmationCommand}
              placeholder={confirmationCommand}
              fullWidth
            />
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>{cancel ?? "Cancel"}</Button>
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
          {confirm ?? "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
