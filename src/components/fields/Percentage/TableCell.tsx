import { IHeavyCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";
import { resultColorsScale } from "@src/utils/color";
import { Color, toColor } from "react-color-palette";

export default function Percentage({ column, value }: IHeavyCellProps) {
  const theme = useTheme();
  const defaultColors = {
    startColor: toColor("hex", "#f00"),
    midColor: toColor("hex", "#ff0"),
    endColor: toColor("hex", "#0f0"),
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

  if (typeof value === "number")
    return (
      <>
        <div
          style={{
            backgroundColor: resultColorsScale(value, colors).toHex(),

            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.5,

            zIndex: 0,
          }}
        />
        <div
          style={{
            textAlign: "right",
            color: theme.palette.text.primary,

            position: "relative",
            zIndex: 1,
          }}
        >
          {Math.round(value * 100)}%
        </div>
      </>
    );

  return null;
}
