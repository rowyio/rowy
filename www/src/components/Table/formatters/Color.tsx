import React from "react";
import withCustomCell, { CustomCellProps } from "./withCustomCell";

import { makeStyles, createStyles, Grid } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {},

    colorIndicator: {
      width: 20,
      height: 20,

      border: `1px solid ${theme.palette.text.disabled}`,
    },
  })
);

function Color({ value }: CustomCellProps) {
  const classes = useStyles();

  if (!value) return null;

  return (
    <Grid container alignItems="center" spacing={1} className={classes.root}>
      <Grid item>
        <div
          className={classes.colorIndicator}
          style={{ backgroundColor: value.hex }}
        />
      </Grid>

      <Grid item xs>
        {value.hex}
      </Grid>
    </Grid>
  );
}

export default withCustomCell(Color);
