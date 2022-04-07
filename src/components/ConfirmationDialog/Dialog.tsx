import { useState } from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

import { SlideTransitionMui } from "@src/components/Modal/SlideTransition";

export default function Confirmation({
  title,
  customBody,
  body,
  cancel,
  hideCancel,
  confirm,
  confirmationCommand,
  handleConfirm,
  handleCancel,
  confirmColor,
  open,
  handleClose,
  maxWidth = "xs",
}: any) {
  const [dryText, setDryText] = useState("");

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        else handleClose();
      }}
      maxWidth={maxWidth}
      TransitionComponent={SlideTransitionMui}
      style={{ cursor: "default" }}
    >
      <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>

      <DialogContent>
        {customBody}
        {body && <DialogContentText>{body}</DialogContentText>}
        {confirmationCommand && (
          <TextField
            value={dryText}
            onChange={(e) => setDryText(e.target.value)}
            autoFocus
            label={`Type ${confirmationCommand} below to continue:`}
            placeholder={confirmationCommand}
            fullWidth
            id="dryText"
            sx={{ mt: 3 }}
          />
        )}
      </DialogContent>

      <DialogActions>
        {!hideCancel && (
          <Button
            onClick={() => {
              if (handleCancel) handleCancel();
              handleClose();
            }}
          >
            {cancel ?? "Cancel"}
          </Button>
        )}
        <Button
          onClick={() => {
            handleConfirm();
            handleClose();
          }}
          color={confirmColor || "primary"}
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
