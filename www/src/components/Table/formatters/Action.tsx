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
import UndoIcon from "@material-ui/icons/Undo";
import { useFiretableContext } from "contexts/firetableContext";
import { SnackContext } from "contexts/snackContext";
import { cloudFunction } from "firebase/callables";
import { sanitiseCallableName, isUrl, sanitiseRowData } from "util/fns";
import { formatPath } from "../../../util/fns";
const useStyles = makeStyles((theme) =>
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

const getStateIcon = (actionState) => {
  switch (actionState) {
    case "undo":
      return <UndoIcon />;
    case "redo":
      return <RefreshIcon />;
    default:
      return <PlayIcon />;
  }
};

export const ActionFab = ({ row, column, onSubmit, value }) => {
  const classes = useStyles();

  const { tableState } = useFiretableContext();
  const { createdAt, updatedAt, id, ref, ...docData } = row;
  const { config } = column as any;

  const action = !value
    ? "run"
    : value.undo
    ? "undo"
    : value.redo
    ? "redo"
    : "";
  const [isRunning, setIsRunning] = useState(false);
  const disabled = column.editable === false;
  const snack = useContext(SnackContext);

  const callableName =
    (column as any).callableName ?? config.callableName ?? "actionScript";
  const handleRun = () => {
    setIsRunning(true);
    const data = {
      ref: { path: ref.path, id: ref.id, tablePath: window.location.pathname },
      row: sanitiseRowData(Object.assign({}, docData)),
      column,
      action,
      schemaDocPath: formatPath(tableState?.tablePath ?? ""),
    };
    cloudFunction(
      callableName,
      data,
      (response) => {
        const { message, cellValue, success } = response.data;
        setIsRunning(false);
        snack.open({
          message: JSON.stringify(message),
          severity: success ? "success" : "error",
        });
        if (cellValue.status) onSubmit(cellValue);
      },
      (error) => {
        console.error("ERROR", callableName, error);
        setIsRunning(false);
        snack.open({ message: JSON.stringify(error), severity: "error" });
      }
    );
  };
  const hasRan = value && value.status;

  const actionState: "run" | "undo" | "redo" = hasRan
    ? value.undo
      ? "undo"
      : "redo"
    : "run";
  let fabButton = (
    <Fab
      size="small"
      color="secondary"
      className={classes.fab}
      onClick={handleRun}
      disabled={
        isRunning ||
        !!(
          hasRan &&
          (config["redo.enabled"] ? false : !value.redo) &&
          (config["undo.enabled"] ? false : !value.undo)
        ) ||
        disabled
      }
    >
      {isRunning ? (
        <CircularProgress color="secondary" size={16} thickness={5.6} />
      ) : (
        getStateIcon(actionState)
      )}
    </Fab>
  );

  if (typeof config.confirmation === "string")
    return (
      <Confirmation
        message={{
          title: `${column.name} Confirmation`,
          body: (actionState === "undo" && config.undoConfirmation
            ? config.undoConfirmation
            : config.confirmation
          ).replace(/\{\{(.*?)\}\}/g, replacer(row)),
        }}
        functionName="onClick"
      >
        {fabButton}
      </Confirmation>
    );

  return fabButton;
};

export default function Action({
  column,
  row,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();
  const { name } = column as any;
  const hasRan = value && value.status;
  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {hasRan && isUrl(value.status) ? (
          <a href={value.status} target="_blank" rel="noopener noreferrer">
            {value.status}
          </a>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(name)
        )}
      </Grid>

      <Grid item>
        <ActionFab
          row={row}
          column={column}
          onSubmit={onSubmit}
          value={value}
        />
      </Grid>
    </Grid>
  );
}
