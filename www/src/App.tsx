import React, { lazy, Suspense } from "react";
import { Route, Switch, Link } from "react-router-dom";
import _merge from "lodash/merge";

import { CssBaseline, Button } from "@material-ui/core";

import CustomBrowserRouter from "./utils/CustomBrowserRouter";
import PrivateRoute from "./utils/PrivateRoute";
import Snack from "./components/Snack";
import ErrorBoundary from "./components/ErrorBoundary";
import EmptyState from "./components/EmptyState";
import Loading from "./components/Loading";

import { SnackProvider } from "./utils/SnackProvider";
import ConfirmationProvider from "components/ConfirmationDialog/Provider";
import { AppProvider } from "./contexts/appContext";
import { FiretableContextProvider } from "./contexts/firetableContext";
import routes from "constants/routes";

import AuthView from "views/AuthViews/GoogleAuthView";
import SignOutView from "views/SignOutView";

const ImpersonatorAuthView = lazy(
  () =>
    import(
      "./views/AuthViews/ImpersonatorAuthView" /* webpackChunkName: "ImpersonatorAuthView" */
    )
);
const JWTAuthView = lazy(
  () => import("./views/AuthViews/JWTAuth" /* webpackChunkName: "JWTAuth" */)
);
const TableView = lazy(
  () => import("./views/TableView" /* webpackChunkName: "TableView" */)
);
// const GridView = lazy(
//   () => import("./views/GridView" /* webpackChunkName: "GridView" */)
// );
const TablesView = lazy(
  () => import("./views/TablesView" /* webpackChunkName: "TablesView" */)
);

export default function App() {
  return (
    <>
      <CssBaseline />
      <ErrorBoundary>
        <AppProvider>
          <ConfirmationProvider>
            <SnackProvider>
              <CustomBrowserRouter>
                <Suspense fallback={<Loading fullScreen />}>
                  <Switch>
                    <Route
                      exact
                      path={routes.auth}
                      render={() => <AuthView />}
                    />
                    <Route
                      exact
                      path={routes.impersonatorAuth}
                      render={() => <ImpersonatorAuthView />}
                    />
                    <Route
                      exact
                      path={routes.jwtAuth}
                      render={() => <JWTAuthView />}
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
          </ConfirmationProvider>
        </AppProvider>
      </ErrorBoundary>
    </>
  );
}
