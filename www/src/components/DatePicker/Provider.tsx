import React, { useState, lazy, Suspense } from "react";

import { datePickerProps } from "./props";
const Dialog = lazy(
  () => import("./Dialog" /* webpackChunkName: "DatePickerDialog" */)
);
import ConfirmationContext from "./Context";
interface IConfirmationProviderProps {
  children: React.ReactNode;
}

const ConfirmationProvider: React.FC<IConfirmationProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<datePickerProps>();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setState(undefined);
    setOpen(false);
  };
  const setDate = (props: datePickerProps) => {
    setState(props);
    setOpen(true);
  };
  return (
    <ConfirmationContext.Provider
      value={{
        props: state,
        open,
        handleClose,
        setDate,
      }}
    >
      {children}

      <Suspense fallback={null}>
        <Dialog {...state} open={open} handleClose={handleClose} />
      </Suspense>
    </ConfirmationContext.Provider>
  );
};

export default ConfirmationProvider;
