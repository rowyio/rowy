import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";

import AuthView from "./views/AuthView";
import TableView from "./views/TableView";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";

import PrivateRoute from "./components/PrivateRoute";
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
        <Router>
          <div>
            <Route exact path="/auth" component={AuthView} />
            <PrivateRoute path="/table/" component={TableView} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
