import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField, InputAdornment, Box, useTheme } from "@mui/material";
import { resultColorsScale } from "@src/utils/color";
import { getFieldId } from "@src/components/SideDrawer/utils";
import { multiply100WithPrecision } from "./utils";

export default function Percentage({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps<number | string>) {
  const { colors } = (column as any).config;
  const theme = useTheme();
  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      onChange={(e) => {
        // Safari/Firefox gives us an empty string for invalid inputs, which includes inputs like "12." on the way to
        // typing "12.34". Number would cast these to 0 and replace the user's input to 0 whilst they're mid-way through
        // typing. We want to avoid that.
        const parsedValue =
          e.target.value === "" ? e.target.value : Number(e.target.value) / 100;
        onChange(parsedValue);
      }}
      onBlur={() => {
        // Cast to number when the user has finished editing
        onChange(Number(value));
        onSubmit();
      }}
      value={
        typeof value === "number" ? multiply100WithPrecision(value) : value
      }
      id={getFieldId(column.key)}
      label=""
      hiddenLabel
      disabled={disabled}
      type="number"
      InputProps={{
        endAdornment: "%",
        startAdornment: (
          <InputAdornment position="start" sx={{ mr: 0 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 0.5,
                boxShadow: `0 0 0 1px ${theme.palette.divider} inset`,
                backgroundColor:
                  typeof value === "number"
                    ? resultColorsScale(
                        value,
                        colors,
                        theme.palette.background.paper
                      ).toHex() + "!important"
                    : undefined,
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{ "& .MuiFilledInput-root": { pl: 0.75 } }}
    />
  );
}
