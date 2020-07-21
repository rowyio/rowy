import React from "react";
import { Controller, Control } from "react-hook-form";

import { useTheme } from "@material-ui/core";
import {
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
} from "@material-ui/pickers";
import { DATE_TIME_FORMAT } from "constants/dates";

import AccessTimeIcon from "@material-ui/icons/AccessTime";

export interface IDateTimePickerProps
  extends Omit<KeyboardDateTimePickerProps, "onChange" | "value"> {
  control: Control;
  name: string;
}

export default function DateTimePicker({
  control,
  name,
  ...props
}: IDateTimePickerProps) {
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
          <KeyboardDateTimePicker
            variant="inline"
            inputVariant="filled"
            fullWidth
            margin="none"
            format={DATE_TIME_FORMAT}
            placeholder={DATE_TIME_FORMAT}
            InputAdornmentProps={{ style: { marginRight: theme.spacing(-1) } }}
            keyboardIcon={<AccessTimeIcon />}
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
