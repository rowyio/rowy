import { IHeavyCellProps } from "../types";

import { Grid, Box } from "@mui/material";

import { resultColorsScale } from "@src/utils/color";

export default function Slider({ column, value }: IHeavyCellProps) {
  const {
    max,
    min,
    unit,
  }: {
    max: number;
    min: number;
    unit?: string;
  } = {
    max: 10,
    min: 0,
    ...(column as any).config,
  };

  const progress =
    value < min || typeof value !== "number"
      ? 0
      : ((value - min) / (max - min)) * 100;

  return (
    <Grid container alignItems="center" wrap="nowrap" spacing={1}>
      <Grid item xs={6} style={{ fontVariantNumeric: "tabular-nums" }}>
        {value ?? 0}/{max} {unit}
      </Grid>

      <Grid item xs={6}>
        <Box
          sx={{
            width: "100%",
            height: 8,
            borderRadius: 1,
            bgcolor: "divider",

            ml: -2 / 8,
          }}
        >
          <Box
            sx={{
              borderRadius: "inherit",
              height: "100%",
              maxWidth: "100%",

              width: `${progress}%`,
              backgroundColor: resultColorsScale(progress / 100).toHex(),
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
