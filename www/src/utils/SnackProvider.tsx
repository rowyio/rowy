import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";
import { SnackContext } from "contexts/SnackContext";

interface ISnackProviderProps {
  children: React.ReactNode;
}

export const SnackProvider: React.FC<ISnackProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(3000);
  const [action, setAction] = useState(<div />);
  const [severity, setSeverity] = useState<
    "error" | "success" | "info" | "warning" | undefined
  >("info");
  const [position, setPosition] = useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "left",
  });
  const close = () => {
    setIsOpen(false);
    setMessage("");
    setDuration(0);
    setSeverity(undefined);
    setAction(<div />);
  };
  const open = (props: {
    message: string;
    duration?: number;
    position?: SnackbarOrigin;
    action?: JSX.Element;
    severity?: "error" | "success" | "info" | "warning" | undefined;
  }) => {
    const { message, duration, position, action, severity } = props;
    setMessage(message);
    if (severity) {
      setSeverity(severity);
    }
    if (action) {
      setAction(action);
    }
    if (duration) {
      setDuration(duration);
    } else {
      setDuration(3000);
    }
    if (position) {
      setPosition(position);
    } else {
      setPosition({ vertical: "bottom", horizontal: "left" });
    }

    setIsOpen(true);
  };
  return (
    <SnackContext.Provider
      value={{
        isOpen,
        message,
        duration,
        position,
        close,
        open,
        action,
        severity: severity,
      }}
    >
      {children}
    </SnackContext.Provider>
  );
};
