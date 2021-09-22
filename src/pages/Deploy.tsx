import { useLocation } from "react-router-dom";
import queryString from "query-string";

import { useMediaQuery, Stack, Typography, Link } from "@mui/material";

import MarketingBanner from "components/Auth/MarketingBanner";
import AuthLayout from "components/Auth/AuthLayout";

import { EXTERNAL_LINKS } from "constants/externalLinks";
import { name } from "@root/package.json";

export default function DeployPage() {
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
          hideProject
          title="Get Started"
          description={
            <>
              To get started with {name}, set up {name} Run on your Google Cloud
              Platform project with this one-click deploy button.
            </>
          }
        >
          <a
            href={EXTERNAL_LINKS.rowyRunDeploy}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://deploy.cloud.run/button.svg"
              alt="Run on Google Cloud"
              style={{ display: "block" }}
            />
          </a>

          <Typography
            variant="caption"
            color="text.secondary"
            style={{ marginTop: 16 }}
          >
            By setting up {name}, you agree to our{" "}
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
