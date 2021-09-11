import { Typography, Paper, Skeleton, Stack, Divider } from "@mui/material";

export default function SettingsSkeleton() {
  return (
    <section style={{ cursor: "default" }}>
      <Typography variant="subtitle1" component="h2" sx={{ mx: 1, mb: 0.5 }}>
        <Skeleton width={120} />
      </Typography>
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },

          "& > :not(style) + :not(style)": {
            m: 0,
            mt: { xs: 2, sm: 3 },
          },
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <div>
            <Skeleton width={120} />
            <Skeleton width={80} />
          </div>

          <Skeleton
            width={100}
            variant="rectangular"
            sx={{ borderRadius: 1 }}
          />
        </Stack>

        <Divider />

        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <div>
            <Skeleton width={120} />
            <Skeleton width={80} />
          </div>

          <Skeleton
            width={100}
            variant="rectangular"
            sx={{ borderRadius: 1 }}
          />
        </Stack>
      </Paper>
    </section>
  );
}
