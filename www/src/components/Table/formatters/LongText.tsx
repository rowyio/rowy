import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      whiteSpace: "pre-line",
      maxHeight: "100%",
      padding: theme.spacing(0.5, 0),
    },
  })
);

function LongText({ value }: CustomCellProps) {
  const classes = useStyles();
  return <div className={classes.root}>{value}</div>;
}

export default withCustomCell(LongText);
