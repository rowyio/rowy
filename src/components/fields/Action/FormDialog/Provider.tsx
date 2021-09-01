import React, { useState } from "react";

import { paramsDialogProps } from "./props";
import Dialog from "./Dialog";
import ActionParamsContext from "./Context";
interface IActionParamsProviderProps {
  children: React.ReactNode;
}

const ActionParamsProvider: React.FC<IActionParamsProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<paramsDialogProps>();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setState(undefined);
    setOpen(false);
  };
  const requestParams = (props: paramsDialogProps) => {
    setState(props);
    setOpen(true);
  };
  return (
    <ActionParamsContext.Provider
      value={{
        dialogProps: state,
        open,
        handleClose,
        requestParams,
      }}
    >
      {children}

      {state && <Dialog {...state} open={open} handleClose={handleClose} />}
    </ActionParamsContext.Provider>
  );
};

export default ActionParamsProvider;
