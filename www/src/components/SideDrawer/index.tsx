import React, { useState } from "react";
import clsx from "clsx";
import _isEmpty from "lodash/isEmpty";

import { Drawer, Fab } from "@material-ui/core";
import ChevronIcon from "@material-ui/icons/KeyboardArrowDown";

import { useStyles } from "./useStyles";
import { useSideDrawerContext } from "contexts/sideDrawerContext";

export const DRAWER_WIDTH = 600;
export const DRAWER_COLLAPSED_WIDTH = 36;

export default function SideDrawer() {
  const classes = useStyles();
  const { columns, selectedCell } = useSideDrawerContext();
  console.log(columns, selectedCell);

  const [open, setOpen] = useState(false);
  const disabled =
    !selectedCell ||
    _isEmpty(selectedCell.row) ||
    _isEmpty(selectedCell.column);

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="right"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
          paperAnchorDockedRight: classes.paper,
        }}
      >
        <div className={classes.drawerContents}>bla</div>
      </Drawer>

      <div
        className={clsx(
          classes.drawerFabContainer,
          open && classes.drawerFabOpen
        )}
      >
        <Fab
          className={classes.drawerFab}
          classes={{ disabled: classes.drawerFabDisabled }}
          color="secondary"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
        >
          <ChevronIcon className={classes.drawerFabIcon} />
        </Fab>
      </div>
    </>
  );
}
