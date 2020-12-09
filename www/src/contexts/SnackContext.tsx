import React, { useContext } from "react";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";

// Default State of our SnackBar
const position: SnackbarOrigin = { vertical: "bottom", horizontal: "left" };
type Severity = "error" | "success" | "info" | "warning" | undefined;
const severity: Severity = undefined as Severity;
const DEFAULT_STATE = {
  isOpen: false, // boolean to control show/hide
  message: "", // text to be displayed in SnackBar
  duration: 2000, // time SnackBar should be visible
  position,
  severity,
  close: () => {},
  open: (props: {
    message: string;
    duration?: number;
    position?: SnackbarOrigin;
    action?: JSX.Element;
    severity?: "error" | "success" | "info" | "warning" | undefined;
  }) => {},
  action: <div />,
};
// Create our Context
export const SnackContext = React.createContext(DEFAULT_STATE);

export const useSnackContext = () => useContext(SnackContext);
