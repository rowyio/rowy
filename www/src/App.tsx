import React, { lazy, Suspense, useState } from "react";
import { Route, Switch, Link } from "react-router-dom";
import _merge from "lodash/merge";

import {
  MuiThemeProvider as ThemeProvider,
  CssBaseline,
  Button,
} from "@material-ui/core";
import Theme from "./Theme";

import CustomBrowserRouter from "./util/CustomBrowserRouter";
import PrivateRoute from "./util/PrivateRoute";
import Snack from "./components/Snack";
import ErrorBoundary from "./components/ErrorBoundary";
import EmptyState from "./components/EmptyState";
import Loading from "./components/Loading";

import { SnackProvider } from "./util/SnackProvider";
import { AppProvider } from "./contexts/appContext";
import { FiretableContextProvider } from "./contexts/firetableContext";
import routes from "constants/routes";

import AuthView from "views/AuthViews/GoogleAuthView";
import SignOutView from "views/SignOutView";

const ImpersonatorAuthView = lazy(() =>
  import(
    "./views/AuthViews/ImpersonatorAuthView" /* webpackChunkName: "ImpersonatorAuthView" */
  )
);

const TableView = lazy(() =>
  import("./views/TableView" /* webpackChunkName: "TableView" */)
);
const GridView = lazy(() =>
  import("./views/GridView" /* webpackChunkName: "GridView" */)
);
const TablesView = lazy(() =>
  import("./views/TablesView" /* webpackChunkName: "TablesView" */)
);
const EditorView = lazy(() =>
  import("./views/EditorView" /* webpackChunkName: "EditorView" */)
);

const App: React.FC = () => {
  const [themeCustomization, setTheme] = useState({
    palette: {
      primary: { main: "#ef4747" },
    },
  });
  return (
    <ThemeProvider theme={Theme(themeCustomization)}>
      <CssBaseline />
      <ErrorBoundary>
        <AppProvider setTheme={setTheme}>
          <SnackProvider>
            <CustomBrowserRouter>
              <Suspense fallback={<Loading fullScreen />}>
                <Switch>
                  <Route exact path={routes.auth} render={() => <AuthView />} />
                  <Route
                    exact
                    path={routes.impersonatorAuth}
                    render={() => <ImpersonatorAuthView />}
                  />
                  <Route
                    exact
                    path={routes.signOut}
                    render={() => <SignOutView />}
                  />

                  <PrivateRoute
                    exact
                    path={[
                      routes.home,
                      routes.tableWithId,
                      routes.tableGroupWithId,
                      routes.gridWithId,
                    ]}
                    render={() => (
                      <FiretableContextProvider>
                        <Switch>
                          <PrivateRoute
                            exact
                            path={routes.home}
                            render={() => <TablesView />}
                          />
                          <PrivateRoute
                            path={routes.tableWithId}
                            render={() => <TableView />}
                          />
                          <PrivateRoute
                            path={routes.tableGroupWithId}
                            render={() => <TableView />}
                          />
                        </Switch>
                      </FiretableContextProvider>
                    )}
                  />

                  <PrivateRoute
                    path={routes.editor}
                    render={() => <EditorView />}
                  />

                  <PrivateRoute
                    render={() => (
                      <EmptyState
                        message="Page Not Found"
                        description={
                          <Button
                            component={Link}
                            to={routes.home}
                            variant="outlined"
                            style={{ marginTop: 8 }}
                          >
                            Go Home
                          </Button>
                        }
                        fullScreen
                      />
                    )}
                  />
                </Switch>
              </Suspense>
              <Snack />
            </CustomBrowserRouter>
          </SnackProvider>
        </AppProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
