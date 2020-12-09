import React, { useContext } from "react";
import { IDatePicker, DATE_PICKER_EMPTY_STATE } from "./props";
const DatePickerContext = React.createContext<IDatePicker>(
  DATE_PICKER_EMPTY_STATE
);
export default DatePickerContext;

export const useDatePicker = () => useContext(DatePickerContext);
