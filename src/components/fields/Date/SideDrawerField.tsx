import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { useTheme } from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { transformValue, sanitizeValue } from "./utils";

export interface IDateProps extends ISideDrawerFieldProps {}

export default function Date_({ column, control }: IDateProps) {
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        control={control}
        name={column.key}
        render={({ onChange, value }) => {
          const transformedValue = transformValue(value);

          const handleChange = (date: Date | null) => {
            const sanitized = sanitizeValue(date);
            if (sanitized === undefined) return;
            onChange(sanitized);
          };

          return <></>;
          // TODO:
          // <DatePicker
          //   inputFormat={column.config?.format ?? DATE_FORMAT}
          //   {...props}
          //   renderInput={(props) => (
          //     <TextField
          //       {...props}
          //       fullWidth
          //       margin="none"
          //       placeholder={column.config?.format ?? DATE_FORMAT}
          //       // TODO: InputAdornmentProps={{
          //       //   style: { marginRight: theme.spacing(-1) },
          //       // }}
          //       // TODO: move this out to side drawer
          //       id={`sidedrawer-field-${column.key}`}
          //       onBlur={onBlur}
          //       label=""
          //       hiddenLabel
          //     />
          //   )}
          //   value={transformedValue}
          //   onChange={handleChange}
          //   disabled={disabled}
          // />
        }}
      />
    </LocalizationProvider>
  );
}
