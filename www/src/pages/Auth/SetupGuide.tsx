import { Typography, Button } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import AuthLayout from "components/Auth/AuthLayout";

export default function AuthSetupGuide() {
  return (
    <AuthLayout>
      <div>
        <Typography variant="h6" component="h2" gutterBottom>
          Firebase Authentication Not Set Up
        </Typography>

        <Typography variant="body1" color="textSecondary">
          Firebase Authentication must be enabled to sign in to Firetable.
        </Typography>
      </div>

      <Button
        variant="contained"
        endIcon={<OpenInNewIcon />}
        component="a"
        href="https://github.com/FiretableProject/firetable/wiki/Set-Up-Firebase-Authentication"
        target="_blank"
        rel="noopener"
      >
        Set-Up Guide
      </Button>
    </AuthLayout>
  );
}
