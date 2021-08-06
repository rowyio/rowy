import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";

import { TextField } from "@material-ui/core";

export default function Number_({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, onBlur, value }) => {
        const handleChange = (e) => onChange(Number(e.target.value));

        return (
          <TextField
            variant="filled"
            fullWidth
            margin="none"
            placeholder={column.name}
            onChange={handleChange}
            onBlur={onBlur}
            value={value}
            id={`sidedrawer-field-${column.key}`}
            label=""
            hiddenLabel
            disabled={disabled}
            type="number"
          />
        );
      }}
    />
  );
}
