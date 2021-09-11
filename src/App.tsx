import { lazy, Suspense } from "react";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { StyledEngineProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import "./space-grotesk.css";

import CustomBrowserRouter from "utils/CustomBrowserRouter";
import PrivateRoute from "utils/PrivateRoute";
import ErrorBoundary from "components/ErrorBoundary";
import EmptyState from "components/EmptyState";
import Loading from "components/Loading";
import Navigation from "components/Navigation";
import Logo from "assets/Logo";

import ConfirmationProvider from "components/ConfirmationDialog/Provider";
import { AppProvider } from "contexts/AppContext";
import { ProjectContextProvider } from "contexts/ProjectContext";
import { SnackbarProvider } from "contexts/SnackbarContext";
import { SnackLogProvider } from "contexts/SnackLogContext";
import routes from "constants/routes";

import AuthView from "pages/Auth";
import SignOutView from "pages/Auth/SignOut";
import TestView from "pages/Test";

import Favicon from "assets/Favicon";
import "analytics";

// prettier-ignore
const AuthSetupGuidePage = lazy(() => import("pages/Auth/SetupGuide" /* webpackChunkName: "AuthSetupGuide" */));
// prettier-ignore
const ImpersonatorAuthPage = lazy(() => import("./pages/Auth/ImpersonatorAuth" /* webpackChunkName: "ImpersonatorAuthPage" */));
// prettier-ignore
const JwtAuthPage = lazy(() => import("./pages/Auth/JwtAuth" /* webpackChunkName: "JwtAuthPage" */));

// prettier-ignore
const HomePage = lazy(() => import("./pages/Home" /* webpackChunkName: "HomePage" */));
// prettier-ignore
const TablePage = lazy(() => import("./pages/Table" /* webpackChunkName: "TablePage" */));

// prettier-ignore
const ProjectSettingsPage = lazy(() => import("./pages/Settings/ProjectSettings" /* webpackChunkName: "ProjectSettingsPage" */));
// prettier-ignore
const UserSettingsPage = lazy(() => import("./pages/Settings/UserSettings" /* webpackChunkName: "UserSettingsPage" */));
// prettier-ignore
const UserManagementPage = lazy(() => import("./pages/Settings/UserManagement" /* webpackChunkName: "UserManagementPage" */));

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ErrorBoundary>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppProvider>
            <Favicon />
            <SnackbarProvider>
              <ConfirmationProvider>
                <SnackLogProvider>
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
                          path={routes.authSetup}
                          render={() => <AuthSetupGuidePage />}
                        />
                        <Route
                          exact
                          path={routes.jwtAuth}
                          render={() => <JwtAuthPage />}
                        />
                        <Route
                          exact
                          path={routes.signOut}
                          render={() => <SignOutView />}
                        />

                        <Route
                          exact
                          path={"/test"}
                          render={() => <TestView />}
                        />

                        <PrivateRoute
                          exact
                          path={[
                            routes.home,
                            routes.tableWithId,
                            routes.tableGroupWithId,
                            routes.gridWithId,
                            routes.settings,
                            routes.projectSettings,
                            routes.userSettings,
                            routes.userManagement,
                            routes.impersonatorAuth,
                          ]}
                          render={() => (
                            <ProjectContextProvider>
                              <Switch>
                                <Route
                                  exact
                                  path={routes.impersonatorAuth}
                                  render={() => <ImpersonatorAuthPage />}
                                />
                                <PrivateRoute
                                  exact
                                  path={routes.home}
                                  render={() => (
                                    <Navigation
                                      title="Home"
                                      titleComponent={
                                        <Logo
                                          style={{
                                            display: "block",
                                            margin: "0 auto",
                                          }}
                                        />
                                      }
                                    >
                                      <HomePage />
                                    </Navigation>
                                  )}
                                />
                                <PrivateRoute
                                  path={routes.tableWithId}
                                  render={() => <TablePage />}
                                />
                                <PrivateRoute
                                  path={routes.tableGroupWithId}
                                  render={() => <TablePage />}
                                />

                                <PrivateRoute
                                  exact
                                  path={routes.settings}
                                  render={() => (
                                    <Redirect to={routes.userSettings} />
                                  )}
                                />
                                <PrivateRoute
                                  exact
                                  path={routes.projectSettings}
                                  render={() => (
                                    <Navigation title="Project Settings">
                                      <ProjectSettingsPage />
                                    </Navigation>
                                  )}
                                />
                                <PrivateRoute
                                  exact
                                  path={routes.userSettings}
                                  render={() => (
                                    <Navigation title="Settings">
                                      <UserSettingsPage />
                                    </Navigation>
                                  )}
                                />
                                <PrivateRoute
                                  exact
                                  path={routes.userManagement}
                                  render={() => (
                                    <Navigation title="User Management">
                                      <UserManagementPage />
                                    </Navigation>
                                  )}
                                />
                              </Switch>
                            </ProjectContextProvider>
                          )}
                        />

                        <PrivateRoute
                          render={() => (
                            <Navigation
                              title="Page Not Found"
                              titleComponent={<div />}
                            >
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
                                style={{ marginTop: -64 }}
                              />
                            </Navigation>
                          )}
                        />
                      </Switch>
                    </Suspense>
                  </CustomBrowserRouter>
                </SnackLogProvider>
              </ConfirmationProvider>
            </SnackbarProvider>
          </AppProvider>
        </LocalizationProvider>
      </ErrorBoundary>
    </StyledEngineProvider>
  );
}
