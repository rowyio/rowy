import React, { useState, useEffect } from "react";
import clsx from "clsx";
import _find from "lodash/find";

import {
  createStyles,
  makeStyles,
  useScrollTrigger,
  Grid,
  AppBar,
  Toolbar,
  Container,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import FiretableLogo from "assets/Firetable";
import NavDrawer, { NAV_DRAWER_WIDTH } from "./NavDrawer";
import UserMenu from "./UserMenu";

export const APP_BAR_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    open: {},

    navDrawerContainer: {
      width: 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),

      "$open &": {
        width: NAV_DRAWER_WIDTH,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },

    appBar: {
      height: APP_BAR_HEIGHT,
      [theme.breakpoints.down("sm")]: { paddingRight: 0 },

      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      "$open &": {
        width: `calc(100% - ${NAV_DRAWER_WIDTH}px)`,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
    maxHeight: {
      height: APP_BAR_HEIGHT,
      minHeight: "auto",
      minWidth: 0,
      maxWidth: "none",
      padding: theme.spacing(0.75, 2),
    },
    toolbar: { padding: 0 },

    openButton: {
      opacity: 1,
      transition: theme.transitions.create("opacity"),
      "$open &": { opacity: 0 },
    },
    logo: {
      flex: 1,
      marginLeft: theme.spacing(1),

      opacity: 1,
      transition: theme.transitions.create("opacity"),
      "$open &": { opacity: 0 },
    },
  })
);

export default function HomeNavigation({
  children,
}: React.PropsWithChildren<{}>) {
  const classes = useStyles();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const [open, setOpen] = useState(false);

  return (
    <Grid
      container
      wrap="nowrap"
      alignItems="flex-start"
      className={clsx(open && classes.open)}
    >
      <Grid item className={classes.navDrawerContainer}>
        <NavDrawer open={open} onClose={() => setOpen(false)} />
      </Grid>

      <Grid item xs>
        <AppBar
          color="inherit"
          elevation={trigger ? 4 : 0}
          className={classes.appBar}
        >
          <Container>
            <Toolbar className={clsx(classes.maxHeight, classes.toolbar)}>
              <IconButton
                aria-label="Open navigation drawer"
                onClick={() => setOpen(true)}
                edge="start"
                className={classes.openButton}
              >
                <MenuIcon />
              </IconButton>

              <div className={classes.logo}>
                <FiretableLogo />
              </div>

              <UserMenu />
            </Toolbar>
          </Container>
        </AppBar>

        {children}
      </Grid>
    </Grid>
  );
}
