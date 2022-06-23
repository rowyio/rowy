import { Box, InputLabel } from "@mui/material";
import ColorPickerInput from "@src/components/ColorPickerInput";
import { ISettingsProps } from "@src/components/fields/types";

import { Color, toColor } from "react-color-palette";

export default function Settings({ onChange, config }: ISettingsProps) {
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
    ...config,
  };

  return (
    <>
      <InputLabel>
        Start Color
        <ColorPickerInput
          value={startColor}
          handleOnChangeComplete={(color) => onChange("startColor")(color)}
        />
      </InputLabel>
      <InputLabel>
        Mid Color
        <ColorPickerInput
          value={midColor}
          handleOnChangeComplete={(color) => onChange("midColor")(color)}
        />
      </InputLabel>
      <InputLabel>
        End Color
        <ColorPickerInput
          value={endColor}
          handleOnChangeComplete={(color) => onChange("endColor")(color)}
        />
      </InputLabel>
      <InputLabel>
        Preview:
        <Box
          sx={{
            height: 30,
            borderRadius: 0.5,
            boxShadow: (theme) => `0 0 0 1px ${theme.palette.divider} inest`,
            background: `linear-gradient(90deg, ${startColor.hex} 0%, ${midColor.hex} 50%, ${endColor.hex} 100%)`,
          }}
        />
      </InputLabel>
    </>
  );
}
