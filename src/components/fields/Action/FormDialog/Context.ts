import React, { useContext } from "react";
import { IActionParams, CONFIRMATION_EMPTY_STATE } from "./props";
const ActionParamsContext = React.createContext<IActionParams>(
  CONFIRMATION_EMPTY_STATE
);
export default ActionParamsContext;

export const useActionParams = () => useContext(ActionParamsContext);
