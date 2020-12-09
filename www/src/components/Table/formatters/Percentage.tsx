import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles } from "@material-ui/core";
import { resultColorsScale } from "utils/color";

const useStyles = makeStyles((theme) =>
  createStyles({
    resultColor: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.5,

      zIndex: 0,
    },

    text: {
      textAlign: "right",
      color: theme.palette.text.primary,

      position: "relative",
      zIndex: 1,
    },
  })
);

export default function Percentage({ value }: CustomCellProps) {
  const classes = useStyles();

  if (typeof value === "number")
    return (
      <>
        <div
          className={classes.resultColor}
          style={{ backgroundColor: resultColorsScale(value).hex() }}
        />
        <div className={classes.text}>{Math.round(value * 100)}%</div>
      </>
    );

  return null;
}
