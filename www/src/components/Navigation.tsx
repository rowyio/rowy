import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  createStyles,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Button,
  Tabs,
  Tab,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import Skeleton from "@material-ui/lab/Skeleton";

import SideDrawer, { DRAWER_COLLAPSED_WIDTH } from "./SideDrawer";

import useRouter from "../hooks/useRouter";

import { SideDrawerProvider } from "contexts/sideDrawerContext";
import { useFiretableContext } from "../contexts/firetableContext";
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
  const [section, setSection] = useState<any>();
  const [table, setTable] = useState();
  const { sections, createTable, userClaims } = useFiretableContext();
  useEffect(() => {
    if (section) {
      setTable(sections![section][0]);
    }
  }, [section]);
  useEffect(() => {
    if (table) {
      const newPath = `${table.collection}${
        table.regional &&
        userClaims.regions &&
        !userClaims.regions.includes("GLOBAL")
          ? `?filters=%5B%7B%22key%22%3A%22region%22%2C%22operator%22%3A%22%3D%3D%22%2C%22value%22%3A%22${userClaims.regions[0]}%22%7D%5D`
          : ""
      }`;
      router.history.push(newPath);
    }
  }, [table]);
  return (
    <SideDrawerProvider>
        {section && sections && (
          <Tabs
            value={table}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, v) => {
              setTable(v);
            }}
            aria-label="disabled tabs example"
          >
            {sections[section].map(table => (
              <Tab key={table.name} label={table.name} value={table} />
            ))}
          </Tabs>
        )}
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

            {!sections ? (
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
                {Object.keys(sections).map((sectionName: string) => (
                  <Grid item key={sectionName}>
                    <Button
                      key={sectionName}
                      // component={Link}
                      // to={table.collection}
                      disabled={sectionName === section}
                      onClick={() => {
                        setSection(sectionName);
                      }}
                      color="inherit"
                      className={classes.routeButton}
                      classes={{
                        root: classes.routeButton,
                        disabled: classes.currentRouteButton,
                      }}
                    >
                      {sectionName}
                    </Button>
                  </Grid>
                ))}
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

          </Toolbar>
        </AppBar>

        <SideDrawer />
      </>

    </SideDrawerProvider>
  );
};
export default Navigation;
