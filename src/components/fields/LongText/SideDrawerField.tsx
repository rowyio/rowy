import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { TextField } from "@mui/material";

export default function LongText({
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
            multiline
            minRows={3}
            inputProps={{ maxLength: column.config?.maxLength }}
          />
        );
      }}
    />
  );
}
