import React, { useContext, useEffect } from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import { SnackContext } from "../contexts/snackContext";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function Snack() {
  const snackContext = useContext(SnackContext);

  const {
    position,
    isOpen,
    close,
    message,
    duration,
    action,
    severity,
  } = snackContext;
  const { vertical, horizontal } = position;

  useEffect(() => {
    if (isOpen) setTimeout(close, 10000);
  }, [isOpen]);
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      key={`${vertical},${horizontal}`}
      open={isOpen}
    >
      <Alert onClose={close} action={action} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
