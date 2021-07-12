import { Typography } from "@material-ui/core";

export default function FiretableLogo() {
  return (
    <Typography
      variant="h4"
      component="h1"
      color="primary"
      style={{
        letterSpacing: 0,
        fontVariantLigatures: "common-ligatures",
        userSelect: "none",
      }}
    >
      firetable
    </Typography>
  );
}
