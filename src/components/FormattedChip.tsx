import { Chip, ChipProps } from "@mui/material";

export const VARIANTS = ["yes", "no", "maybe"];
const paletteColor = {
  yes: "success",
  maybe: "warning",
  no: "error",
} as const;

// TODO: Create a more generalised solution for this
export default function FormattedChip(props: ChipProps) {
  const label =
    typeof props.label === "string" ? props.label.toLowerCase() : "";

  if (VARIANTS.includes(label)) {
    return <Chip size="small" color={paletteColor[label]} {...props} />;
  }

  return <Chip size="small" {...props} />;
}
