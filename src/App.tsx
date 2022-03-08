import { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { StyledEngineProvider } from "@mui/material/styles";
import "./space-grotesk.css";

import CustomBrowserRouter from "@src/utils/CustomBrowserRouter";
import PrivateRoute from "@src/utils/PrivateRoute";
import ErrorBoundary from "@src/components/ErrorBoundary";
import Loading from "@src/components/Loading";
import Navigation from "@src/components/Navigation";
import Logo from "@src/assets/Logo";
import RowyRunModal from "@src/components/RowyRunModal";

import SwrProvider from "@src/contexts/SwrContext";
import ConfirmationProvider from "@src/components/ConfirmationDialog/Provider";
import { AppProvider } from "@src/contexts/AppContext";
import { ProjectContextProvider } from "@src/contexts/ProjectContext";
import { SnackbarProvider } from "@src/contexts/SnackbarContext";
import { SnackLogProvider } from "@src/contexts/SnackLogContext";
import routes from "@src/constants/routes";

import AuthPage from "@src/pages/Auth";
import SignOutPage from "@src/pages/Auth/SignOut";
import SignUpPage from "@src/pages/Auth/SignUp";
import TestPage from "@src/pages/Test";
import RowyRunTestPage from "@src/pages/RowyRunTest";
import PageNotFound from "@src/pages/PageNotFound";

import Favicon from "@src/assets/Favicon";
import "@src/analytics";

// prettier-ignore
const AuthSetupGuidePage = lazy(() => import("@src/pages/Auth/SetupGuide" /* webpackChunkName: "AuthSetupGuide" */));
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
// prettier-ignore
const SetupPage = lazy(() => import("@src/pages/Setup" /* webpackChunkName: "SetupPage" */));

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ErrorBoundary>
        <SwrProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <AppProvider>
              <Favicon />
              <SnackbarProvider>
                <ConfirmationProvider>
                  <SnackLogProvider>
                    <CustomBrowserRouter>
                      <RowyRunModal />
                      <Suspense fallback={<Loading fullScreen />}>
                        <Switch>
                          <Route
                            exact
                            path={routes.auth}
                            render={() => <AuthPage />}
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
                            render={() => <SignOutPage />}
                          />
                          <Route
                            exact
                            path={routes.signUp}
                            render={() => <SignUpPage />}
                          />
                          <Route
                            exact
                            path={routes.setup}
                            render={() => <SetupPage />}
                          />

                          <Route
                            exact
                            path={"/test"}
                            render={() => <TestPage />}
                          />

                          <PrivateRoute
                            exact
                            path={[
                              routes.home,
                              routes.tableWithId,
                              routes.tableGroupWithId,
                              routes.settings,
                              routes.projectSettings,
                              routes.userSettings,
                              routes.userManagement,
                              routes.impersonatorAuth,
                              routes.rowyRunTest,
                            ]}
                            render={() => (
                              <ProjectContextProvider>
                                <Switch>
                                  <Route
                                    exact
                                    path={routes.impersonatorAuth}
                                    render={() => <ImpersonatorAuthPage />}
                                  />
                                  <Route
                                    exact
                                    path={routes.rowyRunTest}
                                    render={() => <RowyRunTestPage />}
                                  />
                                  <PrivateRoute
                                    exact
                                    path={routes.home}
                                    render={() => (
                                      <Navigation
                                        title="Home"
                                        titleComponent={(open, pinned) =>
                                          !(open && pinned) && (
                                            <Logo
                                              style={{
                                                display: "block",
                                                margin: "0 auto",
                                              }}
                                            />
                                          )
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

                          <Route
                            exact
                            path={routes.pageNotFound}
                            render={() => <PageNotFound />}
                          />
                          <Route render={() => <PageNotFound />} />
                        </Switch>
                      </Suspense>
                    </CustomBrowserRouter>
                  </SnackLogProvider>
                </ConfirmationProvider>
              </SnackbarProvider>
            </AppProvider>
          </LocalizationProvider>
        </SwrProvider>
      </ErrorBoundary>
    </StyledEngineProvider>
  );
}
