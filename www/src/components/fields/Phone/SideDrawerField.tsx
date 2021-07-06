import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { TextField } from "@material-ui/core";

export default function Phone({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            placeholder={column.name}
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
