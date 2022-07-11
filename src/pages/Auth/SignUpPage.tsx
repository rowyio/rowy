import { useSearchParams, Link } from "react-router-dom";

import { Typography, Link as MuiLink } from "@mui/material";

import AuthLayout from "@src/layouts/AuthLayout";
import FirebaseUi from "@src/components/FirebaseUi";

import { ROUTES } from "@src/constants/routes";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();

  const uiConfig: firebaseui.auth.Config = {};
  const redirect = searchParams.get("redirect");
  if (typeof redirect === "string" && redirect.length > 0) {
    uiConfig.signInSuccessUrl = redirect;
  }

  return (
    <AuthLayout
      title="Sign up"
      description={
        <>
          <Typography
            color="text.secondary"
            align="right"
            display="block"
            component="span"
            sx={{ mt: -4.25, mb: 2, alignSelf: "flex-end" }}
          >
            or{" "}
            <MuiLink component={Link} to={ROUTES.auth} color="text.secondary">
              sign in
            </MuiLink>
          </Typography>
          Welcome! To join this project, sign up with the email address
          {searchParams.get("email") ? (
            <>
              : <b style={{ userSelect: "all" }}>{searchParams.get("email")}</b>
            </>
          ) : (
            " used to invite you."
          )}
        </>
      }
    >
      <FirebaseUi uiConfig={uiConfig} />
    </AuthLayout>
  );
}
