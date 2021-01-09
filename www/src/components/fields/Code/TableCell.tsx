import React from "react";
import { ICustomCellProps } from "../types";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      maxHeight: "100%",
      padding: theme.spacing(0.5, 0),

      whiteSpace: "pre-wrap",
      lineHeight: theme.typography.body2.lineHeight,
      fontFamily: theme.typography.fontFamilyMono,
      wordBreak: "break-word",
    },
  })
);

export default function Code({ value }: ICustomCellProps) {
  const classes = useStyles();

  return <div className={classes.root}>{value}</div>;
}
