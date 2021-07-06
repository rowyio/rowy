import { useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { makeStyles, createStyles } from "@material-ui/core/styles";
//import {confirmationProps} from './props'
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
}: any) {
  const classes = useStyles();
  const [dryText, setDryText] = useState("");
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>

        <DialogContent>
          {customBody}
          {body && <DialogContentText>{body}</DialogContentText>}
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

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {cancel ?? "Cancel"}
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
            {confirm ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
