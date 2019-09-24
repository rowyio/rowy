import React from "react";

import { ThemeProvider } from "@material-ui/styles";
import Theme from "./Theme";

import AuthView from "./views/AuthView";
import TableView from "./views/TableView";
import TablesView from "./views/TablesView";

import { Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import CustomBrowserRouter from "./util/CustomBrowserRouter";
import PrivateRoute from "./util/PrivateRoute";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <AuthProvider>
        <CustomBrowserRouter>
          <div>
            <Route exact path="/auth" render={() => <AuthView />} />
            <PrivateRoute exact path="/" render={() => <TablesView />} />
            <PrivateRoute path="/table/" render={() => <TableView />} />
          </div>
        </CustomBrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
