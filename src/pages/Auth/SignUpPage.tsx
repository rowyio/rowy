import { useSearchParams } from "react-router-dom";

import { Typography, Link } from "@mui/material";

import AuthLayout from "@src/layouts/AuthLayout";
import FirebaseUi from "@src/components/FirebaseUi";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

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
      <Typography
        variant="caption"
        color="text.secondary"
        style={{ marginTop: 16 }}
      >
        By signing up, you agree to our{" "}
        <Link
          href={EXTERNAL_LINKS.terms}
          target="_blank"
          rel="noopener noreferrer"
          color="text.secondary"
        >
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link
          href={EXTERNAL_LINKS.privacy}
          target="_blank"
          rel="noopener noreferrer"
          color="text.secondary"
        >
          Privacy Policy
        </Link>
        .
      </Typography>
    </AuthLayout>
  );
}
