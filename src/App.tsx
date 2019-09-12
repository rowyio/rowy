import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";

import AuthView from "./views/AuthView";
import TableView from "./views/TableView";
import TablesView from "./views/TablesView";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import CustomBrowserRouter from "./util/CustomBrowserRouter";

import PrivateRoute from "./util/PrivateRoute";
const theme = createMuiTheme({
  spacing: 4,
  palette: {
    primary: {
      main: "#007bff"
    }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
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
