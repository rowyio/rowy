import React, { useContext, useState } from "react";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";

import Snack from "components/Snack";

type Progress = { value: number; target: number };
type Variant =
  | "progress"
  | "error"
  | "success"
  | "info"
  | "warning"
  | undefined;

const DEFAULT_STATE = {
  isOpen: false,
  duration: 10000,
  message: "",
  progress: { value: 0, target: 0 } as Progress,
  action: null as React.ReactNode,
  variant: undefined as Variant,
  position: { vertical: "bottom", horizontal: "left" } as SnackbarOrigin,
};
const DEFAULT_FUNCTIONS = {
  close: () => {},
  setProgress: (progress: Progress) => {},
  open: (newState: Partial<typeof DEFAULT_STATE>) => {},
};

export const SnackContext = React.createContext({
  ...DEFAULT_STATE,
  ...DEFAULT_FUNCTIONS,
});
export const useSnackContext = () => useContext(SnackContext);

export function SnackProvider({ children }: React.PropsWithChildren<{}>) {
  const [state, setState] = useState(DEFAULT_STATE);

  const close = () => setState(DEFAULT_STATE);

  const open: typeof DEFAULT_FUNCTIONS.open = (newState) =>
    setState({ ...DEFAULT_STATE, isOpen: true, ...newState });

  const setProgress: typeof DEFAULT_FUNCTIONS.setProgress = (progress) =>
    setState((state) => ({ ...state, progress }));

  return (
    <SnackContext.Provider
      value={{
        ...state,
        setProgress,
        close,
        open,
      }}
    >
      {children}
      <Snack />
    </SnackContext.Provider>
  );
}
