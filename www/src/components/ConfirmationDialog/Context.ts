import React, { useContext } from "react";
import { IConfirmation, CONFIRMATION_EMPTY_STATE } from "./props";
const ConfirmationContext = React.createContext<IConfirmation>(
  CONFIRMATION_EMPTY_STATE
);
export default ConfirmationContext;

export const useConfirmation = () => useContext(ConfirmationContext);
