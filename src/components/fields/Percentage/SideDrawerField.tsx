import { Controller, useWatch } from "react-hook-form";
import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { inputClasses, TextField } from "@mui/material";
import { emphasize } from "@mui/material/styles";
import { resultColorsScale } from "@src/utils/color";

export default function Percentage({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  const value: number | undefined = useWatch({ control, name: column.key });

  return (
    <Controller
      control={control}
      name={column.key}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextField
          variant="filled"
          fullWidth
          margin="none"
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          onBlur={onBlur}
          value={typeof value === "number" ? value * 100 : value}
          id={`sidedrawer-field-${column.key}`}
          label=""
          hiddenLabel
          disabled={disabled}
          type="number"
          InputProps={{
            endAdornment: "%",
            sx: {
              backgroundColor:
                typeof value === "number"
                  ? resultColorsScale(value).toHex() + "!important"
                  : undefined,
              color:
                typeof value === "number"
                  ? emphasize(resultColorsScale(value).toHex(), 1) +
                    "!important"
                  : undefined,

              [`& ${inputClasses.underline}::after`]: {
                borderColor: "text.primary",
              },
            },
          }}
        />
      )}
    />
  );
}
