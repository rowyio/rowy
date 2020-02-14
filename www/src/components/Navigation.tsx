import React from "react";
import { Link } from "react-router-dom";

import {
  createStyles,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import Skeleton from "@material-ui/lab/Skeleton";

import CreateTableDialog from "./CreateTableDialog";
import SideDrawer, { DRAWER_COLLAPSED_WIDTH } from "./SideDrawer";

import useSettings from "../hooks/useSettings";
import useRouter from "../hooks/useRouter";
import TablesContext from "../contexts/tablesContext";

const useStyles = makeStyles(theme =>
  createStyles({
    appBar: {
      top: "auto",
      bottom: 0,
      paddingRight: DRAWER_COLLAPSED_WIDTH,
    },
    toolbar: { paddingRight: 0 },
    homeButton: { marginRight: theme.spacing(2) },

    fab: {
      position: "absolute",
      zIndex: 1,
      top: -28,
      right: 16,
      margin: "0 auto",
    },

    skeleton: {
      marginLeft: 8,
      borderRadius: 5,
    },

    routes: {
      overflowX: "auto",
      height: 64,
    },
    routeButton: { whiteSpace: "nowrap" },

    currentRouteButton: {
      backgroundColor: "#fff",
      "$routeButton&": { color: theme.palette.primary.main },
    },

    routeSpacer: { width: theme.spacing(10) },
  })
);

// TODO: Create an interface for props
const Navigation = (props: any) => {
  const router = useRouter();
  const classes = useStyles();
  const [settings, createTable] = useSettings();

  return (
    <TablesContext.Provider value={{ value: settings.tables }}>
      <>
        {props.children}

        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="go home"
              component={Link}
              to="/"
              className={classes.homeButton}
            >
              <HomeIcon />
            </IconButton>

            {!settings.tables ? (
              <>
                <Skeleton
                  variant="rect"
                  width={120}
                  height={40}
                  className={classes.skeleton}
                />
                <Skeleton
                  variant="rect"
                  width={120}
                  height={40}
                  className={classes.skeleton}
                />
                <Skeleton
                  variant="rect"
                  width={120}
                  height={40}
                  className={classes.skeleton}
                />
                <Skeleton
                  variant="rect"
                  width={120}
                  height={40}
                  className={classes.skeleton}
                />
              </>
            ) : (
              <Grid
                container
                className={classes.routes}
                wrap="nowrap"
                alignItems="center"
                spacing={2}
              >
                {settings.tables.map(
                  (table: { name: string; collection: string }) => (
                    <Grid item key={table.collection}>
                      <Button
                        key={table.collection}
                        component={Link}
                        to={table.collection}
                        disabled={
                          table.collection ===
                          router.location.pathname.replace("/table/", "")
                        }
                        color="inherit"
                        className={classes.routeButton}
                        classes={{
                          root: classes.routeButton,
                          disabled: classes.currentRouteButton,
                        }}
                      >
                        {table.name}
                      </Button>
                    </Grid>
                  )
                )}
                <Grid item>
                  <div className={classes.routeSpacer} />
                </Grid>
              </Grid>
            )}
            {/* <Button
              onClick={() => {
                auth.signOut();
              }}
            >
              Sign out
            </Button> */}
            <CreateTableDialog classes={classes} createTable={createTable} />
          </Toolbar>
        </AppBar>

        <SideDrawer />
      </>
    </TablesContext.Provider>
  );
};
export default Navigation;
