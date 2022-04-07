import { useState } from "react";
import { useSnackbar } from "notistack";
import _get from "lodash/get";

import { Fab, FabProps } from "@mui/material";
import RunIcon from "@mui/icons-material/PlayArrow";
import RedoIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { functions } from "@src/firebase";
import { useConfirmation } from "@src/components/ConfirmationDialog";
import { useActionParams } from "./FormDialog/Context";
import { runRoutes } from "@src/constants/runRoutes";

import { replacer } from "@src/utils/fns";

const getStateIcon = (actionState, config) => {
  switch (actionState) {
    case "undo":
      return _get(config, "customIcons.undo") || <UndoIcon />;
    case "redo":
      return _get(config, "customIcons.redo") || <RedoIcon />;
    default:
      return _get(config, "customIcons.run") || <RunIcon />;
  }
};

export interface IActionFabProps extends Partial<FabProps> {
  row: any;
  column: any;
  onSubmit: (value: any) => void;
  value: any;
  disabled: boolean;
}

export default function ActionFab({
  row,
  column,
  onSubmit,
  value,
  disabled,
  ...props
}: IActionFabProps) {
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();
  const { requestParams } = useActionParams();
  const { tableState, rowyRun } = useProjectContext();
  const { ref } = row;
  const { config } = column as any;

  const hasRan = value && value.status;

  const action: "run" | "undo" | "redo" = hasRan
    ? value.undo || config.undo?.enabled
      ? "undo"
      : "redo"
    : "run";
  const [isRunning, setIsRunning] = useState(false);

  const callableName: string =
    (column as any).callableName ?? config.callableName ?? "actionScript";

  const fnParams = (actionParams = null) => ({
    ref: { path: ref.path },
    column: { ...column, editor: undefined },
    action,
    schemaDocPath: tableState?.config.tableConfig.path,
    actionParams,
  });

  const handleActionScript = async (data) => {
    if (!rowyRun) return;
    const resp = await rowyRun({
      route: runRoutes.actionScript,
      body: data,
    });
    return resp;
  };
  const handleCallableAction = async (data) => {
    const resp: any = await functions.httpsCallable(callableName)(data);
    return resp.data;
  };

  const handleRun = async (actionParams = null) => {
    try {
      setIsRunning(true);
      const data = fnParams(actionParams);
      let result;

      if (callableName === "actionScript") {
        result = await handleActionScript(data);
      } else {
        result = await handleCallableAction(data);
      }
      const { message, success } = result ?? {};
      enqueueSnackbar(
        typeof message === "string" ? message : JSON.stringify(message),
        {
          variant: success ? "success" : "error",
        }
      );
    } catch (e) {
      console.log(e);
      enqueueSnackbar(`Failed to run action. Check the column settings.`, {
        variant: "error",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const needsParams =
    config.friction === "params" &&
    Array.isArray(config.params) &&
    config.params.length > 0;

  const handleClick = async () => {
    if (needsParams) {
      return requestParams({
        column,
        row,
        handleRun,
      });
    } else if (action === "undo" && config.undo.confirmation) {
      return requestConfirmation({
        title: `${column.name} Confirmation`,
        body: config.undo.confirmation.replace(/\{\{(.*?)\}\}/g, replacer(row)),
        confirm: "Run",
        handleConfirm: () => handleRun(),
      });
    } else if (
      action !== "undo" &&
      config.friction === "confirmation" &&
      typeof config.confirmation === "string"
    ) {
      return requestConfirmation({
        title: `${column.name} Confirmation`,
        body: config.confirmation.replace(/\{\{(.*?)\}\}/g, replacer(row)),
        confirm: "Run",
        handleConfirm: () => handleRun(),
      });
    } else {
      handleRun();
    }
  };
  return (
    <Fab
      onClick={handleClick}
      disabled={
        isRunning ||
        !!(
          hasRan &&
          (config.redo?.enabled ? false : !value.redo) &&
          (config.undo?.enabled ? false : !value.undo)
        ) ||
        disabled
      }
      size="small"
      sx={{
        "&:not(.MuiFab-primary):not(.MuiFab-secondary):not(.Mui-disabled)": {
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? undefined
              : theme.palette.background.default,
        },
      }}
      aria-label={action}
      {...props}
    >
      {isRunning ? (
        <CircularProgressOptical color="secondary" size={16} />
      ) : (
        getStateIcon(action, config)
      )}
    </Fab>
  );
}
