import { ISideDrawerFieldProps } from "@src/components/fields/types";

import { TextField, InputAdornment, Box } from "@mui/material";
import { emphasize } from "@mui/material/styles";
import { resultColorsScale } from "@src/utils/color";
import { getFieldId } from "@src/components/SideDrawer/utils";
import { Color, toColor } from "react-color-palette";

export default function Percentage({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const defaultColors = {
    startColor: toColor("hex", "#ED4747"),
    midColor: toColor("hex", "#F3C900"),
    endColor: toColor("hex", "#1FAD5F"),
  };
  const {
    startColor,
    midColor,
    endColor,
  }: {
    startColor: Color;
    endColor: Color;
    midColor: Color;
  } = {
    ...defaultColors,
    ...(column as any).config,
  };

  const colors = {
    startColor: startColor.hex,
    midColor: midColor.hex,
    endColor: endColor.hex,
  };
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
