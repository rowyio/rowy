import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useTheme } from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from "@material-ui/pickers";
import { DATE_FORMAT } from "constants/dates";
import { transformValue, sanitizeValue } from "./utils";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export interface IDateProps
  extends ISideDrawerFieldProps,
    Omit<KeyboardDatePickerProps, "name" | "onChange" | "value" | "disabled"> {}

export default function Date_({
  column,
  control,
  docRef,
  disabled,
  ...props
}: IDateProps) {
  const theme = useTheme();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        control={control}
        name={column.key}
        render={({ onChange, onBlur, value }) => {
          const transformedValue = transformValue(value);

          const handleChange = (date: Date | null) => {
            const sanitized = sanitizeValue(date);
            if (sanitized === undefined) return;
            onChange(sanitized);
          };

          return (
            <KeyboardDatePicker
              variant="inline"
              inputVariant="filled"
              fullWidth
              margin="none"
              format={column.config?.format ?? DATE_FORMAT}
              placeholder={column.config?.format ?? DATE_FORMAT}
              InputAdornmentProps={{
                style: { marginRight: theme.spacing(-1) },
              }}
              {...props}
              value={transformedValue}
              onChange={handleChange}
              onBlur={onBlur}
              label=""
              hiddenLabel
              // TODO: move this out to side drawer
              id={`sidedrawer-field-${column.key}`}
              disabled={disabled}
            />
          );
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
