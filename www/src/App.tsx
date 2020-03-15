import React, { lazy, Suspense } from "react";
import { Route, Switch, Link } from "react-router-dom";

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
import GlobalStyles from "./util/GlobalStyles";
import { FiretableContextProvider } from "./contexts/firetableContext";
import routes from "constants/routes";

import AuthView from "views/AuthView";
import SignOutView from "views/SignOutView";

const TableView = lazy(() =>
  import("./views/TableView" /* webpackChunkName: "TableView" */)
);
const TablesView = lazy(() =>
  import("./views/TablesView" /* webpackChunkName: "TablesView" */)
);
const EditorView = lazy(() =>
  import("./views/EditorView" /* webpackChunkName: "EditorView" */)
);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <GlobalStyles />
      <ErrorBoundary>
        <AppProvider>
          <SnackProvider>
            <CustomBrowserRouter>
              <Suspense fallback={<Loading fullScreen />}>
                <Switch>
                  <Route exact path={routes.auth} render={() => <AuthView />} />
                  <Route
                    exact
                    path={routes.signOut}
                    render={() => <SignOutView />}
                  />

                  <PrivateRoute
                    exact
                    path={[routes.home, routes.tableWithId]}
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
