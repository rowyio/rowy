import React, { useContext, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { SnackContext } from "contexts/SnackContext";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
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
    variant,
    progress,
  } = snackContext;
  const { vertical, horizontal } = position;

  useEffect(() => {
    if (isOpen && variant !== "progress") setTimeout(close, duration ?? 1000);
  }, [isOpen]);
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      key={`${vertical},${horizontal}`}
      open={isOpen}
    >
      {variant === "progress" ? (
        <Card>
          <Grid container direction="row" justify="space-between">
            {message}
            {progress.value
              ? `${progress.value}${
                  progress.target ? `/${progress.target}` : ""
                }`
              : ""}
            <CircularProgress
              variant={progress.value ? "determinate" : "indeterminate"}
              value={
                progress.target
                  ? (progress.value / progress.target) * 100
                  : progress.value
              }
            />
          </Grid>
        </Card>
      ) : (
        <Alert onClose={close} action={action} severity={variant}>
          {message}
        </Alert>
      )}
    </Snackbar>
  );
}
