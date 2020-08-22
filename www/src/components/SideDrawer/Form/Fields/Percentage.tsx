import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import { makeStyles, createStyles, Typography } from "@material-ui/core";
import { resultColorsScale } from "util/color";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      padding: theme.spacing(9 / 8, 1, 9 / 8, 1.5),
      height: 56,

      width: "100%",
      display: "flex",
      textAlign: "left",
      alignItems: "center",

      position: "relative",
    },

    resultColor: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.09)"
          : "rgba(255, 255, 255, 0.09)",

      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.5,

      zIndex: 0,
    },

    value: {
      position: "relative",
    },
  })
);

export default function Percentage({ control, name }: IFieldProps) {
  const classes = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({ value }) => {
        if (!value)
          return (
            <div className={classes.root}>
              <div className={classes.resultColor} style={{ opacity: 1 }} />
            </div>
          );

        return (
          <div className={classes.root}>
            <div
              className={classes.resultColor}
              style={{
                backgroundColor: resultColorsScale(value as number).hex(),
              }}
            />
            <Typography variant="body1" className={classes.value}>
              {Math.round(value * 100)}%
            </Typography>
          </div>
        );
      }}
    />
  );
}
