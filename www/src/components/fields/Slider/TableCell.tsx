import React from "react";
import { ICustomCellProps } from "../types";
import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    progress: {
      width: "100%",
      margin: 2,
      marginLeft: theme.spacing(2),
      backgroundColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
    },
    bar: {
      borderRadius: theme.shape.borderRadius,
      height: 25,
      maxWidth: "100%",
      backgroundColor: theme.palette.primary.main,
    },
  })
);

export default function Slider({
  row,
  column,
  value,
  onSubmit,
}: ICustomCellProps) {
  const classes = useStyles();

  const {
    max,
    min,
    unit,
  }: {
    max: number;
    min: number;
    unit?: string;
  } = {
    max: 10,
    min: 0,
    ...(column as any).config,
  };

  const progress =
    value < min || typeof value !== "number"
      ? 0
      : ((value - min) / (max - min)) * 100;
  return (
    <>
      {value ?? 0}/{max} {unit}
      <div className={classes.progress}>
        <div className={classes.bar} style={{ width: `${progress}%` }}></div>
      </div>
    </>
  );
}
