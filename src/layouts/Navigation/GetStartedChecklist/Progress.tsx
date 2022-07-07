import { Box, BoxProps, Typography } from "@mui/material";
import { spreadSx } from "@src/utils/ui";

export default function Progress({ sx }: Partial<BoxProps>) {
  return (
    <Box
      sx={[
        { display: "flex", alignItems: "center", gap: 0.5 },
        ...spreadSx(sx),
      ]}
    >
      <Typography style={{ flex: 3 }}>1/5</Typography>

      <Box
        sx={{ flex: 1, borderRadius: 1, height: 8, bgcolor: "success.light" }}
      />
      <Box sx={{ flex: 1, borderRadius: 1, height: 8, bgcolor: "divider" }} />
      <Box sx={{ flex: 1, borderRadius: 1, height: 8, bgcolor: "divider" }} />
      <Box sx={{ flex: 1, borderRadius: 1, height: 8, bgcolor: "divider" }} />
      <Box sx={{ flex: 1, borderRadius: 1, height: 8, bgcolor: "divider" }} />
    </Box>
  );
}
