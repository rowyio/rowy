import React from "react";
import { Controller, Control } from "react-hook-form";

import { useTheme } from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from "@material-ui/pickers";
import { DATE_FORMAT } from "constants/dates";

export interface IDatePickerProps
  extends Omit<KeyboardDatePickerProps, "onChange" | "value"> {
  control: Control;
  name: string;
}

export default function DatePicker({
  control,
  name,
  ...props
}: IDatePickerProps) {
  const theme = useTheme();

  return (
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
            InputAdornmentProps={{ style: { marginRight: theme.spacing(-1) } }}
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
  );
}
