import React, { useContext, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { IFieldProps } from "../utils";

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

export interface IActionProps extends IFieldProps {
  config: { callableName: string };
}

function Action({ control, name, docRef, editable, config }: IActionProps) {
  const classes = useStyles();
  const docData = useWatch({ control });

  const [isRunning, setIsRunning] = useState(false);

  const snack = useContext(SnackContext);
  const disabled = editable === false;

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
        const handleRun = () => {
          setIsRunning(true);
          console.log("RUN");

          cloudFunction(
            config.callableName,
            {
              ref: { path: docRef.path, id: docRef.id },
              row: sanitiseRowData(Object.assign({}, docData)),
            },
            response => {
              const { message, cellValue } = response.data;
              setIsRunning(false);
              snack.open({ message, severity: "success" });
              if (cellValue) onChange(cellValue);
            },
            error => {
              console.error("ERROR", config.callableName, error);
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
            className={classes.root}
            spacing={2}
          >
            <Grid item xs className={classes.labelGridItem}>
              <Grid
                container
                alignItems="center"
                className={classes.labelContainer}
              >
                <Typography variant="body1" className={classes.label}>
                  {hasRan && isUrl(value.status) ? (
                    <a
                      href={value.status}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {value.status}
                    </a>
                  ) : hasRan ? (
                    value.status
                  ) : (
                    sanitiseCallableName(config.callableName)
                  )}
                </Typography>
              </Grid>
            </Grid>

            <Grid item>
              <Fab
                onClick={handleRun}
                disabled={isRunning || !!(hasRan && !value.redo) || disabled}
              >
                {isRunning ? (
                  <CircularProgress
                    color="secondary"
                    size={24}
                    thickness={4.6}
                  />
                ) : hasRan ? (
                  <RefreshIcon />
                ) : (
                  <PlayIcon />
                )}
              </Fab>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default Action;
