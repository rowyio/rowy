import React from "react";
import clsx from "clsx";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      maxHeight: "100%",
      padding: theme.spacing(0.5, 0),
    },
  })
);

function RichText({ value }: CustomCellProps) {
  const classes = useStyles();
  return (
    <div
      dangerouslySetInnerHTML={{ __html: value }}
      className={clsx("rendered-html", classes.root)}
    />
  );
}

export default withCustomCell(RichText);
