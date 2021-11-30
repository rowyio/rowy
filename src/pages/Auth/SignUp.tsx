import { useLocation } from "react-router-dom";
import queryString from "query-string";

import { useMediaQuery, Stack, Typography, Link } from "@mui/material";

import MarketingBanner from "@src/components/Auth/MarketingBanner";
import AuthLayout from "@src/components/Auth/AuthLayout";
import FirebaseUi from "@src/components/Auth/FirebaseUi";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";

export default function SignUpPage() {
  const { search } = useLocation();
  const parsed = queryString.parse(search);

  const uiConfig: firebaseui.auth.Config = {};
  if (typeof parsed.redirect === "string" && parsed.redirect.length > 0) {
    uiConfig.signInSuccessUrl = parsed.redirect;
  }

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <Stack direction="row">
      <MarketingBanner />

      <div style={{ flexGrow: 1 }}>
        <AuthLayout
          hideLogo={!isMobile}
          hideLinks={!isMobile}
          title="Sign up"
          description={
            <>
              Welcome! To join this project, sign in with the email address
              {parsed.email ? (
                <>
                  : <b style={{ userSelect: "all" }}>{parsed.email}</b>
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
      </div>
    </Stack>
  );
}
