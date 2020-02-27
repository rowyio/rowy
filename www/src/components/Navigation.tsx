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

import SideDrawer, {
  DRAWER_COLLAPSED_WIDTH,
  DRAWER_WIDTH,
} from "components/SideDrawer";

import { useFiretableContext, Table } from "contexts/firetableContext";

export const APP_BAR_HEIGHT = 56;

const useStyles = makeStyles(theme =>
  createStyles({
    appBar: {
      paddingRight: ({ sideDrawerOpen }: { sideDrawerOpen?: boolean }) =>
        sideDrawerOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
      height: APP_BAR_HEIGHT,
    },

    maxHeight: {
      height: APP_BAR_HEIGHT,
      minHeight: "auto",
    },
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
  const {
    tables,
    sections,
    userClaims,
    sideDrawerOpen,
  } = useFiretableContext();
  const classes = useStyles({ sideDrawerOpen });

  // Find the matching section for the current route
  const section = _find(tables, ["collection", tableCollection?.split("/")[0]])
    ?.section;

  // Get the table path, including filtering for regions & user permissions
  const getTablePath = (table: Table): LinkProps["to"] => {
    if (!table || !userClaims) return "";

    if (table.regional && !userClaims.regions?.includes("GLOBAL"))
      return {
        pathname: table.collection,
        search: `?filters=${encodeURIComponent(
          JSON.stringify([
            { key: "region", operator: "==", value: userClaims.regions[0] },
          ])
        )}`,
      };

    return table.collection;
  };

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        className={classes.appBar}
      >
        {section && sections && (
          <Tabs
            value={tableCollection.split("/")[0]}
            indicatorColor="primary"
            textColor="primary"
            action={actions =>
              setTimeout(() => actions?.updateIndicator(), 200)
            }
            component="nav"
            variant="scrollable"
          >
            {sections[section].map(table => (
              <Tab
                key={table.collection}
                label={table.name}
                value={table.collection}
                component={Link}
                to={getTablePath(table)}
                className={classes.maxHeight}
              />
            ))}
          </Tabs>
        )}
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
  );
}
