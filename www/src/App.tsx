import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import {
  MuiThemeProvider as ThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import Theme from "./Theme";

import CustomBrowserRouter from "./util/CustomBrowserRouter";
import PrivateRoute from "./util/PrivateRoute";
import Snack from "./components/Snack";
import ErrorBoundary from "./components/ErrorBoundary";
import EmptyState from "./components/EmptyState";
import Loading from "./components/Loading";

import { SnackProvider } from "./util/SnackProvider";
import { AppProvider } from "./AppProvider";
import GlobalStyles from "./util/GlobalStyles";

const AuthView = lazy(() => import("./views/AuthView"));
const TableView = lazy(() => import("./views/TableView"));
const TablesView = lazy(() => import("./views/TablesView"));
const EditorView = lazy(() => import("./views/EditorView"));

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
                  <Route exact path="/auth" render={() => <AuthView />} />
                  <PrivateRoute exact path="/" render={() => <TablesView />} />
                  <PrivateRoute path="/table/" render={() => <TableView />} />
                  <PrivateRoute path="/editor" render={() => <EditorView />} />
                  <Route
                    render={() => (
                      <EmptyState message="Page Not Found" fullScreen />
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
