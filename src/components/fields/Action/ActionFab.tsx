import { useState } from "react";
import { useSnackbar } from "notistack";
import { get } from "lodash-es";
import { useAtom, useSetAtom } from "jotai";
import { httpsCallable } from "firebase/functions";

import { Button, Fab, FabProps, Link } from "@mui/material";
import RunIcon from "@mui/icons-material/PlayArrow";
import RedoIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";
import CircularProgressOptical from "@src/components/CircularProgressOptical";

import { firebaseFunctionsAtom } from "@src/sources/ProjectSourceFirebase";
import {
  projectScope,
  confirmDialogAtom,
  rowyRunAtom,
} from "@src/atoms/projectScope";
import { tableScope, tableSettingsAtom } from "@src/atoms/tableScope";
import { useActionParams } from "./FormDialog/Context";
import { runRoutes } from "@src/constants/runRoutes";
import { getTableSchemaPath } from "@src/utils/table";

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return get(data, objKey, defaultValue);
};

const getStateIcon = (actionState: "undo" | "redo" | string, config: any) => {
  if (!get(config, "customIcons.enabled", false)) {
    switch (actionState) {
      case "undo":
        return <UndoIcon />;
      case "redo":
        return <RedoIcon />;
      default:
        return <RunIcon />;
    }
  }
  switch (actionState) {
    case "undo":
      return get(config, "customIcons.undo") || <UndoIcon />;
    case "redo":
      return get(config, "customIcons.redo") || <RedoIcon />;
    default:
      return get(config, "customIcons.run") || <RunIcon />;
  }
};

export interface IActionFabProps extends Partial<FabProps> {
  row: any;
  column: any;
  value: any;
  disabled: boolean;
}

export default function ActionFab({
  row,
  column,
  value,
  disabled,
  ...props
}: IActionFabProps) {
  const confirm = useSetAtom(confirmDialogAtom, projectScope);
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [firebaseFunctions] = useAtom(firebaseFunctionsAtom, projectScope);

  const { enqueueSnackbar } = useSnackbar();
  const { requestParams } = useActionParams();
  const { _rowy_ref: ref } = row;
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
    schemaDocPath: getTableSchemaPath(tableSettings),
    actionParams,
  });

  const handleActionScript = async (data: any) => {
    if (!rowyRun) return;
    const resp = await rowyRun({
      route: runRoutes.actionScript,
      body: data,
    });
    return resp;
  };
  const handleCallableAction = async (data: any) => {
    const resp: any = await httpsCallable(firebaseFunctions, callableName, {
      timeout: 550000,
    })(data);
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
      const { message, success, link } = result ?? {};
      enqueueSnackbar(
        typeof message === "string" ? message : JSON.stringify(message),
        {
          variant: success ? "success" : "error",
          action: link ? (
            typeof link === "string" ? (
              <Button
                variant="outlined"
                href={link}
                component={Link}
                target="_blank"
              >
                Link
              </Button>
            ) : (
              <Button
                href={link.url}
                component={Link}
                variant="outlined"
                target="_blank"
              >
                {link.label}
              </Button>
            )
          ) : undefined,
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
    } else if (action === "undo" && config.undo?.confirmation) {
      return confirm({
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
      return confirm({
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
        zIndex: 1,
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
