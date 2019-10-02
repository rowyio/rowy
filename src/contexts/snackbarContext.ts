import React from "react";
// Default State of our SnackBar
const DEFAULT_STATE = {
  show: false, // boolean to control show/hide
  displayText: "", // text to be displayed in SnackBar
  timeOut: 2000, // time SnackBar should be visible
};
// Create our Context
const SnackBarContext = React.createContext(DEFAULT_STATE);
