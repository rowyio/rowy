import { useState } from "react";
import { useAtom } from "jotai";

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
import { globalScope, confirmDialogAtom } from "@src/atoms/globalScope";

/**
 * Display a confirm dialog using `confirmDialogAtom` in `globalState`
 * @see {@link confirmDialogAtom | Usage example}
 */
export default function ConfirmDialog() {
  const [
    {
      open,

      title = "Are you sure?",
      body,

      handleConfirm,
      confirm = "Confirm",
      confirmationCommand,
      confirmColor,

      handleCancel,
      cancel = "Cancel",
      hideCancel,

      maxWidth = "xs",
      buttonLayout = "horizontal",
    },
    setState,
  ] = useAtom(confirmDialogAtom, globalScope);
  const handleClose = () => setState({ open: false });

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
      sx={{ cursor: "default", zIndex: (theme) => theme.zIndex.modal + 50 }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        {typeof body === "string" ? (
          <DialogContentText>{body}</DialogContentText>
        ) : (
          body
        )}
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

      <DialogActions
        sx={[
          buttonLayout === "vertical" && {
            flexDirection: "column",
            alignItems: "stretch",
            "& > :not(:first-of-type)": { ml: 0, mt: 1 },
          },
        ]}
      >
        {!hideCancel && (
          <Button
            onClick={() => {
              if (handleCancel) handleCancel();
              handleClose();
            }}
          >
            {cancel}
          </Button>
        )}
        <Button
          onClick={() => {
            if (handleConfirm) handleConfirm();
            handleClose();
          }}
          color={confirmColor || "primary"}
          variant="contained"
          autoFocus
          disabled={
            confirmationCommand ? dryText !== confirmationCommand : false
          }
        >
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
