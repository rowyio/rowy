import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField } from "@mui/material";

export default function Number_({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextField
          variant="filled"
          fullWidth
          margin="none"
          onChange={(e) => onChange(Number(e.target.value))}
          onBlur={onBlur}
          value={value}
          id={`sidedrawer-field-${column.key}`}
          label=""
          hiddenLabel
          disabled={disabled}
          type="number"
        />
      )}
    />
  );
}
