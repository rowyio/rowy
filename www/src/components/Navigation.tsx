import React from "react";
import { Link } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import MenuIcon from "@material-ui/icons/Menu";
import Skeleton from "@material-ui/lab/Skeleton";

import CreateTableDialog from "./CreateTableDialog";

import useSettings from "../hooks/useSettings";
import useRouter from "../hooks/useRouter";
import TablesContext from "../contexts/tablesContext";
// import { auth } from "../firebase";

const useStyles = makeStyles(theme =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 20,
      paddingTop: 5,
    },

    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: "auto",
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fab: {
      position: "absolute",
      zIndex: 1,
      top: -30,
      right: 20,
      margin: "0 auto",
    },
    button: {
      color: "#fff",
      marginLeft: 8,
    },
    skeleton: {
      marginLeft: 8,
      borderRadius: 5,
    },
    routes: {
      flex: "flex-shrink",
      overflowX: "auto",
    },
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
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="go home"
              component={Link}
              to="/"
            >
              <MenuIcon />
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
              <div className={classes.routes}>
                {settings.tables.map(
                  (table: { name: string; collection: string }) => (
                    <Button
                      key={table.collection}
                      onClick={() => {
                        if (
                          table.collection !==
                          router.location.pathname.replace("/table/", "")
                        ) {
                          //prevent redirecting to the same table
                          router.history.push(table.collection);
                        }
                      }}
                      className={classes.button}
                    >
                      {table.name}
                    </Button>
                  )
                )}
              </div>
            )}
            {/* <Button
              onClick={() => {
                auth.signOut();
              }}
            >
              Sign out
            </Button> */}
            <CreateTableDialog classes={classes} createTable={createTable} />
            <div className={classes.grow} />
          </Toolbar>
        </AppBar>
      </>
    </TablesContext.Provider>
  );
};
export default Navigation;
