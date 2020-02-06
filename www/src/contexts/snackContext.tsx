import React from "react";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";

// Default State of our SnackBar
const position: SnackbarOrigin = { vertical: "bottom", horizontal: "left" };
const DEFAULT_STATE = {
  isOpen: false, // boolean to control show/hide
  message: "", // text to be displayed in SnackBar
  duration: 2000, // time SnackBar should be visible
  position,
  close: () => {},
  open: (props: {
    message: string;
    duration?: number;
    position?: SnackbarOrigin;
    action?: JSX.Element;
  }) => {
    console.log(props.message, props.duration);
  },
  action: <div />,
};
// Create our Context
export const SnackContext = React.createContext(DEFAULT_STATE);
