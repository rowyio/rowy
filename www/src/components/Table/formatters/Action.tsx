import React, { useContext, useState } from "react";
import { CustomCellProps } from "./withCustomCell";
import clsx from "clsx";

import {
  createStyles,
  makeStyles,
  Grid,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
import RefreshIcon from "@material-ui/icons/Refresh";

import { SnackContext } from "contexts/snackContext";
import { cloudFunction } from "firebase/callables";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { padding: theme.spacing(0, 0.375, 0, 1.5) },
    labelContainer: { overflowX: "hidden" },
    fab: { width: 36, height: 36 },
  })
);

export default function Action({
  column,
  row,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();

  const { createdAt, updatedAt, id, ref, ...docData } = row;
  const { callableName } = column as any;

  const [isRunning, setIsRunning] = useState(false);

  const snack = useContext(SnackContext);
  const handleRun = () => {
    setIsRunning(true);
    cloudFunction(
      callableName,
      { ref: { path: ref.path, id: ref.id }, row: docData, column },
      response => {
        const { message, cellValue } = response.data;
        setIsRunning(false);
        snack.open({ message, severity: "success" });
        if (cellValue) onSubmit(cellValue);
      },
      error => {
        setIsRunning(false);
        snack.open({ message: JSON.stringify(error), severity: "error" });
      }
    );
  };

  const hasRan = value && value.status;

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {hasRan
          ? value.status
          : callableName?.replace("callable-", "").replace(/([A-Z])/g, " $1")}
      </Grid>

      <Grid item>
        <Fab
          size="small"
          color="secondary"
          className={classes.fab}
          onClick={handleRun}
          disabled={isRunning || !!(hasRan && !value.redo)}
        >
          {isRunning ? (
            <CircularProgress color="secondary" size={16} thickness={5.6} />
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
