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
import { sanitiseCallableName, isUrl, sanitiseRowData } from "util/fns";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},

    labelGridItem: { width: `calc(100% - 56px - ${theme.spacing(2)}px)` },
    labelContainer: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),

      textAlign: "left",
      minHeight: 56,
    },
    label: {
      whiteSpace: "normal",
      width: "100%",
      overflow: "hidden",
    },
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
      {
        ref: { path: ref.path, id: ref.id },
        row: sanitiseRowData(Object.assign({}, docData)),
      },
      response => {
        const { message, cellValue } = response.data;
        setIsRunning(false);
        snack.open({ message, severity: "success" });
        if (cellValue) form.setFieldValue(field.name, cellValue);
      },
      error => {
        console.error("ERROR", callableName, error);
        setIsRunning(false);
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
      <Grid item xs className={classes.labelGridItem}>
        <Grid container alignItems="center" className={classes.labelContainer}>
          <Typography variant="body1" className={classes.label}>
            {hasRan && isUrl(field.value.status) ? (
              <a
                href={field.value.status}
                target="_blank"
                rel="noopener noreferer"
              >
                {field.value.status}
              </a>
            ) : hasRan ? (
              field.value.status
            ) : (
              sanitiseCallableName(callableName)
            )}
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
