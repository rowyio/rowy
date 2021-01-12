import React from "react";
import { IPopoverBasicCellProps } from "../types";

import { makeStyles, createStyles, Grid, ButtonBase } from "@material-ui/core";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      paddingLeft: theme.spacing(1.5),

      font: "inherit",
      color: "inherit !important",
      letterSpacing: "inherit",
      textAlign: "inherit",
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
  { value, setShowComplexCell, disabled }: IPopoverBasicCellProps,
  ref: React.Ref<any>
) {
  const classes = useStyles();

  return (
    <Grid
      container
      alignItems="center"
      spacing={1}
      className={classes.root}
      component={ButtonBase}
      onClick={() => setShowComplexCell(true)}
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
