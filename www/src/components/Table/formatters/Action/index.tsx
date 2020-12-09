import React from "react";
import { CustomCellProps } from "../withCustomCell";
import clsx from "clsx";

import _get from "lodash/get";
import { createStyles, makeStyles, Grid } from "@material-ui/core";

import { sanitiseCallableName, isUrl } from "utils/fns";
import ActionFab from "./ActionFab";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: { padding: theme.spacing(0, 0.375, 0, 1.5) },
    labelContainer: { overflowX: "hidden" },
  })
);

export default function Action({
  column,
  row,
  value,
  onSubmit,
}: CustomCellProps) {
  const classes = useStyles();
  const { name } = column as any;
  const hasRan = value && value.status;
  return (
    <Grid
      container
      alignItems="center"
      wrap="nowrap"
      className={clsx("cell-collapse-padding", classes.root)}
    >
      <Grid item xs className={classes.labelContainer}>
        {hasRan && isUrl(value.status) ? (
          <a href={value.status} target="_blank" rel="noopener noreferrer">
            {value.status}
          </a>
        ) : hasRan ? (
          value.status
        ) : (
          sanitiseCallableName(name)
        )}
      </Grid>

      <Grid item>
        <ActionFab
          row={row}
          column={column}
          onSubmit={onSubmit}
          value={value}
        />
      </Grid>
    </Grid>
  );
}
