import React, { useContext, useState } from "react";
import { CustomCellProps } from "./withCustomCell";
import clsx from "clsx";
import Confirmation from "components/Confirmation";
import _get from "lodash/get";
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
import { sanitiseCallableName, isUrl } from "util/fns";

const useStyles = makeStyles(theme =>
  createStyles({
    root: { padding: theme.spacing(0, 0.375, 0, 1.5) },
    labelContainer: { overflowX: "hidden" },
    fab: { width: 36, height: 36 },
  })
);

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _get(data, objKey, defaultValue);
};

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
  const disabled = column.editable === false;
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
        console.error("ERROR", callableName, error);
        setIsRunning(false);
        snack.open({ message: JSON.stringify(error), severity: "error" });
      }
    );
  };
  const hasRan = value && value.status;
  let component = (
    <Fab
      size="small"
      color="secondary"
      className={classes.fab}
      onClick={handleRun}
      disabled={isRunning || !!(hasRan && !value.redo) || disabled}
    >
      {isRunning ? (
        <CircularProgress color="secondary" size={16} thickness={5.6} />
      ) : hasRan ? (
        <RefreshIcon />
      ) : (
        <PlayIcon />
      )}
    </Fab>
  );

  if ((column as any)?.config?.confirmation)
    component = (
      <Confirmation
        message={{
          title: (column as any).config.confirmation.title,
          body: (column as any).config.confirmation.body.replace(
            /\{\{(.*?)\}\}/g,
            replacer(row)
          ),
        }}
        functionName="onClick"
      >
        {component}
      </Confirmation>
    );

  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {hasRan && isUrl(value.status) ? (
          <a href={value.status} target="_blank" rel="noopener noreferer">
            {value.status}
          </a>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(callableName)
        )}
      </Grid>

      <Grid item>{component}</Grid>
    </Grid>
  );
}
