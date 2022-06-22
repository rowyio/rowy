import { IHeavyCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";
import { resultColorsScale } from "@src/utils/color";

export default function Percentage({ column, value }: IHeavyCellProps) {
  const theme = useTheme();
  const {
    startColor,
    midColor,
    endColor,
  }: {
    startColor: any;
    endColor: any;
    midColor: any;
  } = {
    startColor: { hex: "#f00" },
    midColor: { hex: "#0f0" },
    endColor: { hex: "#00f" },
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
