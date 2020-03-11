import React, { useContext, useState } from "react";
import { FieldProps } from "formik";

import {
  createStyles,
  makeStyles,
  Grid,
  Typography,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
import RefreshIcon from "@material-ui/icons/Refresh";

import { SnackContext } from "contexts/snackContext";
import { cloudFunction } from "firebase/callables";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},

    labelContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      width: "100%",
      display: "flex",
      textAlign: "left",
      minHeight: 56,
    },
    label: { whiteSpace: "normal" },
  })
);

function Action({
  field,
  form,
  editable,
  callableName,
}: FieldProps<any> & { callableName: string; editable?: boolean }) {
  const classes = useStyles();
  const { ref, ...docData } = form.values;

  const [isRunning, setIsRunning] = useState(false);

  const snack = useContext(SnackContext);
  const handleRun = () => {
    setIsRunning(true);
    console.log("RUN");

    cloudFunction(
      callableName,
      { ref: { path: ref.path, id: ref.id }, row: docData },
      response => {
        const { message, cellValue } = response.data;
        setIsRunning(false);
        snack.open({ message, severity: "success" });
        if (cellValue) form.setFieldValue(field.name, cellValue);
      },
      error => {
        setIsRunning(false);
        console.log(error);
        snack.open({ message: JSON.stringify(error), severity: "error" });
      }
    );
  };

  const hasRan = field.value && field.value.status;
  const disabled = editable === false;
  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      className={classes.root}
      spacing={2}
    >
      <Grid item xs>
        <Grid container alignItems="center" className={classes.labelContainer}>
          <Typography variant="body1" className={classes.label}>
            {hasRan
              ? field.value.status
              : callableName
                  ?.replace("callable-", "")
                  .replace(/([A-Z])/g, " $1")}
          </Typography>
        </Grid>
      </Grid>

      <Grid item>
        <Fab
          onClick={handleRun}
          disabled={isRunning || !!(hasRan && !field.value.redo) || disabled}
        >
          {isRunning ? (
            <CircularProgress color="secondary" size={24} thickness={4.6} />
          ) : hasRan ? (
            <RefreshIcon />
          ) : (
            <PlayIcon />
          )}
        </Fab>
      </Grid>
    </Grid>
  );
}

export default Action;
