import { Chip, ChipProps } from "@mui/material";

export const VARIANTS = ["yes", "no", "maybe"] as const;
const paletteColor = {
  yes: "success",
  maybe: "warning",
  no: "error",
} as const;

// TODO: Create a more generalised solution for this
export default function FormattedChip(props: ChipProps) {
  const label =
    typeof props.label === "string" ? props.label.toLowerCase() : "";

  if (VARIANTS.includes(label as any)) {
    return (
      <Chip
        size="small"
        // color={paletteColor[label as typeof VARIANTS[number]]}
        sx={{
          backgroundColor: `${
            paletteColor[label as typeof VARIANTS[number]]
          }.main`,
        }}
        {...props}
      />
    );
  }

  return <Chip size="small" {...props} />;
}
