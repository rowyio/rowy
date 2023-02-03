import { IDisplayCellProps } from "@src/components/fields/types";

import { useTheme } from "@mui/material";
import { resultColorsScale } from "@src/utils/color";
import { multiply100WithPrecision } from "./utils";

export default function Percentage({ column, value }: IDisplayCellProps) {
  const theme = useTheme();
  const { colors } = (column as any).config;

  const percentage = typeof value === "number" ? value : 0;
  return (
    <>
      <div
        style={{
          backgroundColor: resultColorsScale(
            percentage,
            colors,
            theme.palette.background.paper
          ).toHex(),
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
        {multiply100WithPrecision(percentage)}%
      </div>
    </>
  );
}
