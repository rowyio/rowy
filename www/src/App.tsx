import React, { lazy, Suspense } from "react";

import { ThemeProvider } from "@material-ui/styles";
import Theme from "./Theme";

import { Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import CustomBrowserRouter from "./util/CustomBrowserRouter";
import PrivateRoute from "./util/PrivateRoute";
const AuthView = lazy(() => import("./views/AuthView"));
const TableView = lazy(() => import("./views/TableView"));
const TablesView = lazy(() => import("./views/TablesView"));
const EditorView = lazy(() => import("./views/EditorView"));

const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <AuthProvider>
        <CustomBrowserRouter>
          <div>
            <Suspense fallback={<div>Loading View</div>}>
              <Route exact path="/auth" render={() => <AuthView />} />
              <PrivateRoute exact path="/" render={() => <TablesView />} />
              <PrivateRoute path="/table/" render={() => <TableView />} />
              <PrivateRoute path="/editor" render={() => <EditorView />} />
            </Suspense>
          </div>
        </CustomBrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
