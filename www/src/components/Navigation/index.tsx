import React, { useState, useEffect } from "react";
import _find from "lodash/find";

import { makeStyles, createStyles } from "@material-ui/styles";
import { AppBar, Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import Breadcrumbs from "./Breadcrumbs";
import NavDrawer from "./NavDrawer";

// import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";
import { useFiretableContext } from "contexts/FiretableContext";
import UserMenu from "./UserMenu";

export const APP_BAR_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      // paddingRight: DRAWER_COLLAPSED_WIDTH,
      height: APP_BAR_HEIGHT,
      [theme.breakpoints.down("md")]: { paddingRight: 0 },

      backgroundColor: theme.palette.background.default,
    },

    toolbar: {
      height: APP_BAR_HEIGHT,
      minHeight: "auto",
      minWidth: 0,
      maxWidth: "none",
      padding: theme.spacing(0, 2),
    },

    breadcrumbs: { flex: 1 },
  })
);

export default function Navigation({
  children,
  tableCollection,
}: React.PropsWithChildren<{ tableCollection: string }>) {
  const { tables } = useFiretableContext();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [tableCollection]);

  // Find the matching section for the current route
  const currentSection = _find(tables, [
    "collection",
    tableCollection?.split("/")[0],
  ])?.section;
  const currentTable = tableCollection?.split("/")[0];

  useEffect(() => {
    const name =
      _find(tables, ["collection", currentTable])?.name || currentTable;
    document.title = `${name} | Firetable`;

    return () => {
      document.title = "Firetable";
    };
  }, [currentTable]);

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            aria-label="Open navigation drawer"
            onClick={() => setOpen(true)}
            size="large"
            edge="start"
          >
            <MenuIcon />
          </IconButton>

          <Breadcrumbs className={classes.breadcrumbs} />

          <UserMenu />
          {/* <Notifications /> */}
        </Toolbar>
      </AppBar>

      <NavDrawer
        currentSection={currentSection}
        currentTable={currentTable}
        open={open}
        onClose={() => setOpen(false)}
      />

      {children}
    </>
  );
}
