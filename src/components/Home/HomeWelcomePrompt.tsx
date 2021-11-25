import { Zoom, Stack, Typography } from "@mui/material";

export default function HomeWelcomePrompt() {
  return (
    <Zoom in style={{ transformOrigin: `${320 - 52}px ${320 - 52}px` }}>
      <Stack
        justifyContent="center"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          boxShadow: 24,

          width: 320,
          height: 320,
          p: 5,
          borderRadius: "50% 50% 0 50%",

          position: "fixed",
          bottom: 0,
          right: 0,
        }}
      >
        <Typography variant="overline" component="h1" gutterBottom>
          Get started
        </Typography>

        <Typography variant="h5" component="p">
          Create a table from a new or existing Firestore collection
        </Typography>
      </Stack>
    </Zoom>
  );
}
