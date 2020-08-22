import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import { useTheme } from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from "@material-ui/pickers";
import { DATE_FORMAT } from "constants/dates";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export interface IDatePickerProps
  extends IFieldProps,
    Omit<KeyboardDatePickerProps, "name" | "onChange" | "value"> {}

export default function DatePicker({
  control,
  docRef,
  name,
  ...props
}: IDatePickerProps) {
  const theme = useTheme();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        control={control}
        name={name}
        render={({ onChange, onBlur, value }) => {
          let transformedValue = null;
          if (value && "toDate" in value) transformedValue = value.toDate();
          else if (value !== undefined) transformedValue = value;

          const handleChange = (date: Date | null) => {
            if (isNaN(date?.valueOf() ?? 0)) return;
            onChange(date);
          };

          return (
            <KeyboardDatePicker
              variant="inline"
              inputVariant="filled"
              fullWidth
              margin="none"
              format={DATE_FORMAT}
              placeholder={DATE_FORMAT}
              InputAdornmentProps={{
                style: { marginRight: theme.spacing(-1) },
              }}
              {...props}
              value={transformedValue}
              onChange={handleChange}
              onBlur={onBlur}
              label=""
              hiddenLabel
              id={`sidedrawer-field-${name}`}
            />
          );
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
