import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField, InputAdornment, Box } from "@mui/material";
import { resultColorsScale } from "@src/utils/color";
import { getFieldId } from "@src/components/SideDrawer/utils";

export default function Percentage({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const { colors } = (column as any).config;
  return (
    <TextField
      variant="filled"
      fullWidth
      margin="none"
      onChange={(e) => onChange(Number(e.target.value) / 100)}
      onBlur={onSubmit}
      value={typeof value === "number" ? value * 100 : value}
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
                boxShadow: (theme) =>
                  `0 0 0 1px ${theme.palette.divider} inest`,
                backgroundColor:
                  typeof value === "number"
                    ? resultColorsScale(value, colors).toHex() + "!important"
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
