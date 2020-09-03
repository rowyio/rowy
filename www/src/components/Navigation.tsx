import React from "react";
import clsx from "clsx";
import _find from "lodash/find";
import { Link, LinkProps } from "react-router-dom";

import {
  createStyles,
  makeStyles,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Grid,
  Button,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

import { DRAWER_COLLAPSED_WIDTH } from "components/SideDrawer";

import { useFiretableContext, Table } from "contexts/firetableContext";

export const APP_BAR_HEIGHT = 56;

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      paddingRight: DRAWER_COLLAPSED_WIDTH,
      height: APP_BAR_HEIGHT,

      [theme.breakpoints.down("sm")]: { paddingRight: 0 },
    },

    maxHeight: {
      height: APP_BAR_HEIGHT,
      minHeight: "auto",
      minWidth: 0,
      maxWidth: "none",
      padding: theme.spacing(0.75, 2),
    },

    topToolbar: { padding: theme.spacing(0, 2) },
    topDivider: { marginTop: -1 },

    bottomAppBar: {
      top: "auto",
      bottom: 0,
    },
    homeButton: { marginRight: theme.spacing(1.5) },

    scrollableSections: {
      overflowY: "auto",
      height: APP_BAR_HEIGHT,
      width: `calc(100% + ${theme.spacing(3)}px)`,
      marginRight: theme.spacing(-2),
    },

    sectionButton: { whiteSpace: "nowrap" },
    sectionButtonCurrent: {
      backgroundColor: "#fff",
      "$sectionButton&": { color: theme.palette.primary.main },
    },
  })
);

export default function Navigation({
  children,
  tableCollection,
}: React.PropsWithChildren<{ tableCollection: string }>) {
  const { tables, sections, userClaims } = useFiretableContext();
  const classes = useStyles();

  // Find the matching section for the current route
  const section = _find(tables, ["collection", tableCollection?.split("/")[0]])
    ?.section;

  // Get the table path, including filtering for user permissions
  const getTablePath = (table: Table): LinkProps["to"] => {
    if (!table || !userClaims) return "";
    return table.isCollectionGroup
      ? `/tableGroup/${table.collection}`
      : `/table/${table.collection}`;
  };

  const currentCollection = tableCollection.split("/")[0];

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={clsx(classes.maxHeight, classes.topToolbar)}>
          {sections && (
            <Tabs
              value={currentCollection}
              indicatorColor="primary"
              textColor="primary"
              action={(actions) =>
                setTimeout(() => actions?.updateIndicator(), 200)
              }
              component="nav"
              variant="scrollable"
            >
              {section ? (
                sections[section].map((table) => (
                  <Tab
                    key={table.collection}
                    label={table.name}
                    value={table.collection}
                    component={Link}
                    to={getTablePath(table)}
                    className={classes.maxHeight}
                  />
                ))
              ) : (
                <Tab
                  label={currentCollection}
                  value={currentCollection}
                  className={classes.maxHeight}
                />
              )}
            </Tabs>
          )}
        </Toolbar>
        <Divider className={classes.topDivider} />
      </AppBar>

      {children}

      <AppBar
        component="footer"
        position="fixed"
        color="primary"
        className={clsx(classes.appBar, classes.bottomAppBar)}
      >
        <Toolbar component="nav" className={classes.maxHeight}>
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

          <Grid
            container
            wrap="nowrap"
            alignItems="center"
            spacing={2}
            className={classes.scrollableSections}
          >
            {sections &&
              Object.entries(sections).map(([sectionName, tables]) => (
                <Grid item key={sectionName}>
                  <Button
                    key={sectionName}
                    disabled={sectionName === section}
                    // onClick={handleSectionClick(sectionName)}
                    component={Link}
                    replace={true}
                    to={getTablePath(tables[0])}
                    color="inherit"
                    className={classes.sectionButton}
                    classes={{
                      root: classes.sectionButton,
                      disabled: classes.sectionButtonCurrent,
                    }}
                  >
                    {sectionName}
                  </Button>
                </Grid>
              ))}
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}
