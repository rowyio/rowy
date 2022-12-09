import { useSearchParams, Link } from "react-router-dom";

import { Typography, Link as MuiLink } from "@mui/material";

import AuthLayout from "@src/layouts/AuthLayout";
import FirebaseUi from "@src/components/FirebaseUi";

import { ROUTES } from "@src/constants/routes";

export default function AuthPage() {
  const [searchParams] = useSearchParams();

  const uiConfig: firebaseui.auth.Config = {};
  const redirect = searchParams.get("redirect");
  if (typeof redirect === "string" && redirect.length > 0) {
    uiConfig.signInSuccessUrl = redirect;
  }

  return (
    <AuthLayout
      title="Sign in"
      description={
        <Typography
          color="text.secondary"
          align="right"
          display="block"
          component="span"
          sx={{ mt: -4.25, alignSelf: "flex-end" }}
        >
          or{" "}
          <MuiLink component={Link} to={ROUTES.signUp} color="text.secondary">
            sign up
          </MuiLink>
        </Typography>
      }
    >
      <FirebaseUi uiConfig={uiConfig} />
    </AuthLayout>
  );
}
