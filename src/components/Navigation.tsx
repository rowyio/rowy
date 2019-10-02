import React from "react";

import {
  makeStyles,
  createStyles,
  AppBar,
  CssBaseline,
  Toolbar,
  IconButton,
  Button,
} from "@material-ui/core";
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
    fabButton: {
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
  })
);

// TODO: Create an interface for props
const Navigation = (props: any) => {
  const router = useRouter();
  const classes = useStyles();
  const [settings, createTable] = useSettings();
  return (
    <TablesContext.Provider value={{ value: settings.tables }}>
      <React.Fragment>
        <CssBaseline />
        {props.children}
        <AppBar position="fixed" color="primary" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer">
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
              <>
                {settings.tables.map(
                  (table: { name: string; collection: string }) => (
                    <Button
                      key={table.collection}
                      onClick={() => {
                        router.history.push(table.collection);
                      }}
                      className={classes.button}
                    >
                      {table.name}
                    </Button>
                  )
                )}
              </>
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
      </React.Fragment>
    </TablesContext.Provider>
  );
};
export default Navigation;
