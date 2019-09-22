import React from "react";

import { ThemeProvider } from "@material-ui/styles";
import Theme from "./Theme";

import AuthView from "./views/AuthView";
import TableView from "./views/TableView";
import TablesView from "./views/TablesView";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import CustomBrowserRouter from "./util/CustomBrowserRouter";
import PrivateRoute from "./util/PrivateRoute";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <AuthProvider>
        <CustomBrowserRouter>
          <div>
            <Route exact path="/auth" component={AuthView} />
            <PrivateRoute exact path="/" component={TablesView} />
            <PrivateRoute path="/table/" component={TableView} />
          </div>
        </CustomBrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
