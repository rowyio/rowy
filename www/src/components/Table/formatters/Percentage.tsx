import React from "react";
import { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles } from "@material-ui/core";

function percentageToHsl(percentage: number, hue0: number, hue1: number) {
  var hue = percentage * (hue1 - hue0) + hue0;
  return "hsl(" + hue + ", 100%, 50%)";
}

const useStyles = makeStyles(theme =>
  createStyles({
    rating: { color: theme.palette.text.secondary },
    iconEmpty: { color: theme.palette.text.secondary },
  })
);

export default function Percentage({
  row,
  column,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();
  if (typeof value === "number") {
    const backgroundColor = percentageToHsl(100 - value, 120, 0);
    return <div style={{ backgroundColor }}>{Math.round(value * 100)} %</div>;
  } else return <div>%</div>;
}
