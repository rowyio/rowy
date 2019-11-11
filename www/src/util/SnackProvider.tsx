import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";
import { SnackContext } from "../contexts/snackContext";
interface ISnackProviderProps {
  children: React.ReactNode;
}

export const SnackProvider: React.FC<ISnackProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(3000);
  const [action, setAction] = useState(<div />);
  const [position, setPosition] = useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "left",
  });
  const close = () => {
    setIsOpen(false);
    setMessage("");
    setDuration(0);
  };
  const open = (props: {
    message: string;
    duration?: number;
    position?: SnackbarOrigin;
    action?: JSX.Element;
  }) => {
    const { message, duration, position, action } = props;
    setMessage(message);
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
      }}
    >
      {children}
    </SnackContext.Provider>
  );
};
