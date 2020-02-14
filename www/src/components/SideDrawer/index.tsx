import React, { useState } from "react";
import clsx from "clsx";

import { Drawer, Fab } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import { useStyles } from "./useStyles";

export const DRAWER_WIDTH = 600;
export const DRAWER_COLLAPSED_WIDTH = 36;

export default function SideDrawer() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

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

      <Fab
        className={clsx(classes.drawerFab, open && classes.drawerFabOpen)}
        color="secondary"
        onClick={() => setOpen(o => !o)}
        disabled
      >
        <ChevronLeftIcon className={classes.drawerFabIcon} />
      </Fab>
    </>
  );
}
