import { Chip, ChipProps } from "@mui/material";
import palette, { paletteToMui } from "@src/theme/palette";
import { useTheme } from "@mui/material";
import { isEqual } from "lodash-es";

export const VARIANTS = ["yes", "no", "maybe"] as const;
const paletteColor = {
  yes: paletteToMui(palette.green),
  maybe: paletteToMui(palette.yellow),
  no: paletteToMui(palette.aRed),
} as const;

// Switched to a more generalized solution - adding backwards compatibility to maintain [Yes, No, Maybe] colors even if no color is selected
// Modified by @devsgnr
export default function FormattedChip(props: ChipProps) {
  const defaultColor = paletteToMui(palette.aGray);
  const { mode } = useTheme().palette;
  const fallback = { backgroundColor: defaultColor[mode] };
  const { sx, ...newProps } = props;

  const label =
    typeof props.label === "string" ? props.label.toLowerCase() : "";
  const inVariant = VARIANTS.includes(label as any);

  return (
    <Chip
      size="small"
      sx={
        inVariant && isEqual(props.sx, fallback)
          ? {
              backgroundColor:
                paletteColor[label as typeof VARIANTS[number]][mode],
            }
          : props.sx
      }
      {...newProps}
    />
  );
}
