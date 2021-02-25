import React, { useContext } from "react";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";

// Default State of our SnackBar
const position: SnackbarOrigin = { vertical: "bottom", horizontal: "left" };
const progress = { value: 0, target: 0 };
export type variantType =
  | "progress"
  | "error"
  | "success"
  | "info"
  | "warning"
  | undefined;
const variant: variantType = undefined as variantType;
const DEFAULT_STATE = {
  isOpen: false, // boolean to control show/hide
  message: "", // text to be displayed in SnackBar
  duration: 2000, // time SnackBar should be visible
  position,
  progress,
  variant,
  close: () => {},
  setProgress: (props: { value: number; target: number }) => {},
  open: (props: {
    message: string;
    duration?: number;
    position?: SnackbarOrigin;
    action?: JSX.Element;
    variant?: "progress" | "error" | "success" | "info" | "warning" | undefined;
  }) => {},
  action: <div />,
};
// Create our Context
export const SnackContext = React.createContext(DEFAULT_STATE);

export const useSnackContext = () => useContext(SnackContext);
