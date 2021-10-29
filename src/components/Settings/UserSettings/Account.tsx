import { IUserSettingsChildProps } from "@src/pages/Settings/UserSettings";
import { Link } from "react-router-dom";

import { Grid, Avatar, Typography, Button } from "@mui/material";

import routes from "@src/constants/routes";

export default function Account({ settings }: IUserSettingsChildProps) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Avatar src={settings.user.photoURL} />
      </Grid>

      <Grid item xs>
        <Typography variant="body1" style={{ userSelect: "all" }}>
          {settings.user.displayName}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ userSelect: "all" }}
        >
          {settings.user.email}
        </Typography>
      </Grid>

      <Grid item>
        <Button component={Link} to={routes.signOut}>
          Sign out
        </Button>
      </Grid>
    </Grid>
  );
}
