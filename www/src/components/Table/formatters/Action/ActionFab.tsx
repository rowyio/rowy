import React, { useContext, useState } from "react";
//import Confirmation from "components/Confirmation";
import _get from "lodash/get";
import {
  createStyles,
  makeStyles,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
import RefreshIcon from "@material-ui/icons/Refresh";
import UndoIcon from "@material-ui/icons/Undo";
import { useFiretableContext } from "contexts/FiretableContext";
import { SnackContext } from "contexts/SnackContext";
import { cloudFunction } from "firebase/callables";
import { sanitiseRowData } from "utils/fns";
import { formatPath } from "../../../../utils/fns";
import { useConfirmation } from "components/ConfirmationDialog";
import { useActionParams } from "./FormDialog/Context";
//import ParamsDialog from './ParamsDialog'
const useStyles = makeStyles((theme) =>
  createStyles({
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

export default ({ row, column, onSubmit, value }) => {
  const classes = useStyles();
  const { requestConfirmation } = useConfirmation();
  const { requestParams } = useActionParams();
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
  const handleRun = (actionParams = null) => {
    setIsRunning(true);

    const data = {
      ref: { path: ref.path, id: ref.id, tablePath: window.location.pathname },
      row: sanitiseRowData(Object.assign({}, docData)),
      column,
      action,
      schemaDocPath: formatPath(tableState?.tablePath ?? ""),
      actionParams,
    };
    console.log({ data });
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
        if (cellValue && cellValue.status) onSubmit(cellValue);
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

  const needsParams = Array.isArray(config.params) && config.params.length > 0;
  const needsConfirmation =
    typeof config.confirmation === "string" && config.confirmation !== "";
  return (
    <Fab
      size="small"
      color="secondary"
      className={classes.fab}
      onClick={
        needsParams
          ? () =>
              requestParams({
                column,
                row,
                handleRun,
              })
          : needsConfirmation
          ? () =>
              requestConfirmation({
                title: `${column.name} Confirmation`,
                body: (actionState === "undo" && config.undoConfirmation
                  ? config.undoConfirmation
                  : config.confirmation
                ).replace(/\{\{(.*?)\}\}/g, replacer(row)),
                confirm: "Run",
                handleConfirm: () => handleRun(),
              })
          : () => handleRun()
      }
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
};
