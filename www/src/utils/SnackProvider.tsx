import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { SnackbarOrigin } from "@material-ui/core/Snackbar";
import { SnackContext, variantType } from "contexts/SnackContext";

interface ISnackProviderProps {
  children: React.ReactNode;
}

export const SnackProvider: React.FC<ISnackProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(3000);
  const [progress, setProgress] = useState({ value: 0, target: 0 });
  const [action, setAction] = useState(<div />);
  const [variant, setvariant] = useState<variantType>("info");
  const [position, setPosition] = useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "left",
  });
  const close = () => {
    setIsOpen(false);
    setMessage("");
    setDuration(0);
    setvariant(undefined);
    setAction(<div />);
  };
  const open = (props: {
    message: string;
    duration?: number;
    position?: SnackbarOrigin;
    action?: JSX.Element;
    variant?: variantType;
  }) => {
    const { message, duration, position, action, variant } = props;
    setMessage(message);
    if (variant) {
      setvariant(variant);
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
        progress,
        setProgress,
        close,
        open,
        action,
        variant: variant,
      }}
    >
      {children}
    </SnackContext.Provider>
  );
};
