import React, { useContext, useState } from "react";

const DEFAULT_STATE = {
  isSnackLogOpen: false,
  latestBuildTimestamp: 0,
};
const DEFAULT_FUNCTIONS = {
  requestSnackLog: () => {},
  closeSnackLog: () => {},
};

export const SnackLogContext = React.createContext({
  ...DEFAULT_STATE,
  ...DEFAULT_FUNCTIONS,
});
export const useSnackLogContext = () => useContext(SnackLogContext);

export function SnackLogProvider({ children }: React.PropsWithChildren<{}>) {
  const [state, setState] = useState(DEFAULT_STATE);

  const requestSnackLog: typeof DEFAULT_FUNCTIONS.requestSnackLog = () => {
    setTimeout(() => {
      setState({
        ...state,
        latestBuildTimestamp: Date.now(),
        isSnackLogOpen: true,
      });
    }, 500);
  };

  const closeSnackLog: typeof DEFAULT_FUNCTIONS.closeSnackLog = () =>
    setState({
      ...state,
      latestBuildTimestamp: 0,
      isSnackLogOpen: false,
    });

  return (
    <SnackLogContext.Provider
      value={{
        ...state,
        requestSnackLog,
        closeSnackLog,
      }}
    >
      {children}
    </SnackLogContext.Provider>
  );
}
