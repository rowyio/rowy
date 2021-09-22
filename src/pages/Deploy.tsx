import { useLocation } from "react-router-dom";
import queryString from "query-string";

import { useMediaQuery, Stack, Typography, Link } from "@mui/material";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import MarketingBanner from "components/Auth/MarketingBanner";
import AuthLayout from "components/Auth/AuthLayout";

import { EXTERNAL_LINKS, WIKI_LINKS } from "constants/externalLinks";
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
          hideLinks={!isMobile}
          title="Get Started"
          description={
            <>
              <Typography variant="inherit" paragraph>
                Set up {name} on your Google Cloud Platform project with this
                one-click deploy button.
              </Typography>

              <Typography variant="inherit">
                You must have a project set up on Google Cloud Platform or
                Firebase.
                <br />
                <Link
                  href={WIKI_LINKS.setUpAuth}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="text.primary"
                >
                  Learn how to create one
                  <InlineOpenInNewIcon />
                </Link>
              </Typography>
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
              width={183}
              height={32}
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
