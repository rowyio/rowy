import React from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import { useTheme } from "@material-ui/core";
import {
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
} from "@material-ui/pickers";
import { DATE_TIME_FORMAT } from "constants/dates";

import DateRangeIcon from "@material-ui/icons/DateRange";
import TimeIcon from "@material-ui/icons/Schedule";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export interface IDateTimePickerProps
  extends IFieldProps,
    Omit<KeyboardDateTimePickerProps, "name" | "onChange" | "value"> {}

export default function DateTimePicker({
  control,
  docRef,
  name,
  ...props
}: IDateTimePickerProps) {
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
            <KeyboardDateTimePicker
              variant="inline"
              inputVariant="filled"
              fullWidth
              margin="none"
              format={DATE_TIME_FORMAT}
              placeholder={DATE_TIME_FORMAT}
              InputAdornmentProps={{
                style: { marginRight: theme.spacing(-1) },
              }}
              keyboardIcon={<TimeIcon />}
              {...props}
              value={transformedValue}
              onChange={handleChange}
              onBlur={onBlur}
              label=""
              hiddenLabel
              id={`sidedrawer-field-${name}`}
              dateRangeIcon={
                <DateRangeIcon
                  style={{ color: theme.palette.primary.contrastText }}
                />
              }
              timeIcon={
                <TimeIcon
                  style={{ color: theme.palette.primary.contrastText }}
                />
              }
            />
          );
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
