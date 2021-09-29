import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { TextField } from "@mui/material";

export default function Phone({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            id={`sidedrawer-field-${column.key}`}
            label=""
            hiddenLabel
            disabled={disabled}
            type="tel"
            inputProps={{
              autoComplete: "tel",
              maxLength: column.config?.maxLength,
            }}
          />
        );
      }}
    />
  );
}
