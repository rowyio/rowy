import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import Navigation from "./components/Navigation";
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
      <Navigation />
    </ThemeProvider>
  );
};

export default App;
