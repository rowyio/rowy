import React from "react";
import clsx from "clsx";
import { IPopoverInlineCellProps } from "../types";

import { makeStyles, createStyles, Grid, ButtonBase } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      font: "inherit",
      color: "inherit !important",
      letterSpacing: "inherit",
      textAlign: "inherit",

      padding: theme.spacing(0, 1),
    },

    colorIndicator: {
      width: 20,
      height: 20,

      boxShadow: `0 0 0 1px ${theme.palette.text.disabled} inset`,
      borderRadius: theme.shape.borderRadius / 2,
    },
  })
);

export const Color = React.forwardRef(function Color(
  { value, showPopoverCell, disabled }: IPopoverInlineCellProps,
  ref: React.Ref<any>
) {
  const classes = useStyles();

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      className={clsx("cell-collapse-padding", classes.root)}
      component={ButtonBase}
      onClick={() => showPopoverCell(true)}
      ref={ref}
      disabled={disabled}
    >
      <Grid item>
        <div
          className={classes.colorIndicator}
          style={{ backgroundColor: value?.hex }}
        />
      </Grid>

      <Grid item xs>
        {value?.hex}
      </Grid>
    </Grid>
  );
});
export default Color;
