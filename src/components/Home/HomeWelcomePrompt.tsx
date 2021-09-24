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
          p: 8,
          pl: 9,
          borderRadius: "50% 50% 0 50%",

          position: "fixed",
          bottom: 0,
          right: 0,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome!
          <br />
          Create a table to get started.
        </Typography>

        <Typography>
          Tables connect to your Firestore collections and display their data.
        </Typography>
      </Stack>
    </Zoom>
  );
}
