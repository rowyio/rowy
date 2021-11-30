import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import DatePicker from "@mui/lab/DatePicker";
import { TextField } from "@mui/material";

import { transformValue, sanitizeValue } from "../Date/utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { DateTimeIcon } from ".";

export interface IDateProps extends ISideDrawerFieldProps {}

export default function Date_({ column, control }: IDateProps) {
  const format = column.config?.format ?? DATE_TIME_FORMAT;

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, value } }) => {
        const transformedValue = transformValue(value);

        const handleChange = (date: Date | null) => {
          const sanitized = sanitizeValue(date);
          if (sanitized === undefined) return;
          onChange(sanitized);
        };

        return (
          <DatePicker
            renderInput={(props) => (
              <TextField
                {...props}
                fullWidth
                label=""
                hiddenLabel
                aria-label={column.name as string}
                InputProps={{
                  ...props.InputProps,
                  endAdornment: props.InputProps?.endAdornment || (
                    <DateTimeIcon color="action" />
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontVariantNumeric: "tabular-nums",
                  },
                  "& .MuiInputAdornment-root": { m: 0 },
                }}
                // Touch mode: make the whole field clickable
                onClick={props.inputProps?.onClick as any}
              />
            )}
            label={column.name}
            value={transformedValue}
            onChange={handleChange}
            inputFormat={format}
            mask={format.replace(/[A-Za-z]/g, "_")}
            clearable
            OpenPickerButtonProps={{ size: "small" }}
            components={{ OpenPickerIcon: DateTimeIcon }}
            disableOpenPicker={false}
          />
        );
      }}
    />
  );
}
