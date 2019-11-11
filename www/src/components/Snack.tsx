import React, { useContext, useEffect } from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import { SnackContext } from "../contexts/snackContext";
export default function Snack() {
  const snackContext = useContext(SnackContext);

  const { position, isOpen, close, message, duration, action } = snackContext;
  const { vertical, horizontal } = position;

  useEffect(() => {
    if (isOpen) setTimeout(close, 10000);
  }, [isOpen]);
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      key={`${vertical},${horizontal}`}
      open={isOpen}
      onClose={close}
      ContentProps={{
        "aria-describedby": "message-id",
      }}
      message={<span id="message-id">{message}</span>}
      action={action}
    />
  );
}
