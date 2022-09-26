import { Box, BoxProps, Typography } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

export interface IStepsProgressProps extends Partial<BoxProps> {
  steps: number;
  value: number;
}

export default function StepsProgress({
  steps,
  value,
  sx,
  ...props
}: IStepsProgressProps) {
  return (
    <Box
      {...props}
      sx={[
        { display: "flex", alignItems: "center", gap: 0.5 },
        ...spreadSx(sx),
      ]}
    >
      <Typography
        className="steps-progress__label"
        sx={{ flex: 3, fontVariantNumeric: "tabular-nums" }}
      >
        {Math.min(Math.max(value, 0), steps)}/{steps}
      </Typography>

      {new Array(steps).fill(undefined).map((_, i) => (
        <Box
          key={i + 1}
          sx={{
            flex: 1,
            borderRadius: 1,
            height: 8,
            bgcolor: i + 1 <= value ? "success.light" : "divider",
            transition: (theme) => theme.transitions.create("background-color"),
          }}
        />
      ))}
    </Box>
  );
}
