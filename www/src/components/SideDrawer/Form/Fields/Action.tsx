import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { IFieldProps } from "../utils";

import { createStyles, makeStyles, Grid, Typography } from "@material-ui/core";
import { sanitiseCallableName, isUrl } from "utils/fns";

import ActionFab from "../../../Table/formatters/Action/ActionFab";
const useStyles = makeStyles((theme) =>
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

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => {
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
                    sanitiseCallableName(name)
                  )}
                </Typography>
              </Grid>
            </Grid>

            <Grid item>
              <ActionFab
                row={{ ...docData, ref: docRef }}
                column={{ config, key: name }}
                onSubmit={onChange}
                value={value}
              />
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default Action;
