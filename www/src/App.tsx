import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

import {
  MuiThemeProvider as ThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import Theme from "./Theme";

import CustomBrowserRouter from "./util/CustomBrowserRouter";
import PrivateRoute from "./util/PrivateRoute";
import Snack from "./components/Snack";
import { SnackProvider } from "./util/SnackProvider";

import { AppProvider } from "./AppProvider";
const AuthView = lazy(() => import("./views/AuthView"));
const TableView = lazy(() => import("./views/TableView"));
const TablesView = lazy(() => import("./views/TablesView"));
const EditorView = lazy(() => import("./views/EditorView"));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <AppProvider>
        <SnackProvider>
          <CustomBrowserRouter>
            <div>
              <Suspense fallback={<div>Loading View</div>}>
                <Route exact path="/auth" render={() => <AuthView />} />
                <PrivateRoute exact path="/" render={() => <TablesView />} />
                <PrivateRoute path="/table/" render={() => <TableView />} />
                <Snack />
              </Suspense>
            </div>
          </CustomBrowserRouter>
        </SnackProvider>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
