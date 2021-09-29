import { useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import {
  useMediaQuery,
  Stack,
  Typography,
  Link,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

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

  const [confirmProject, setConfirmProject] = useState(false);
  const [confirmFirestore, setConfirmFirestore] = useState(false);
  const [confirmAuth, setConfirmAuth] = useState(false);

  return (
    <Stack direction="row">
      <MarketingBanner />

      <div style={{ flexGrow: 1 }}>
        <AuthLayout
          hideLogo={!isMobile}
          hideProject
          hideLinks={!isMobile}
          title="Get started"
          description={
            <>
              <FormControl component="fieldset" variant="standard">
                <FormLabel
                  component="legend"
                  sx={{ fontWeight: "medium", color: "text.primary" }}
                >
                  Make sure you have the following:
                </FormLabel>
                <FormGroup style={{ textAlign: "left" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={confirmProject}
                        onChange={(e) => setConfirmProject(e.target.checked)}
                      />
                    }
                    label="A Google Cloud or Firebase project"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={confirmFirestore}
                        onChange={(e) => setConfirmFirestore(e.target.checked)}
                      />
                    }
                    label="Firestore enabled"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={confirmAuth}
                        onChange={(e) => setConfirmAuth(e.target.checked)}
                      />
                    }
                    label="Firebase Authentication with the Google sign-in method enabled"
                  />
                </FormGroup>
              </FormControl>

              <Typography sx={{ mt: 3 }}>
                Don’t have a project? Follow our{" "}
                <Link
                  href={WIKI_LINKS.firebaseProject}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  step-by-step guide
                </Link>{" "}
                to get started.
              </Typography>
            </>
          }
        >
          {confirmProject && confirmFirestore && confirmAuth ? (
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
          ) : (
            <img
              src="https://deploy.cloud.run/button.svg"
              alt="Run on Google Cloud"
              style={{ display: "block", filter: "grayscale(1)", opacity: 0.6 }}
              width={183}
              height={32}
            />
          )}

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
