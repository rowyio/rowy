import { useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { SwitchTransition } from "react-transition-group";

import {
  useMediaQuery,
  Stack,
  Typography,
  Grow,
  Button,
  Collapse,
  Link,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import MarketingBanner from "@src/components/Auth/MarketingBanner";
import AuthLayout from "@src/components/Auth/AuthLayout";

import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";
import { name } from "@root/package.json";

export default function DeployPage() {
  const { search } = useLocation();
  const parsed = queryString.parse(search);

  const uiConfig: firebaseui.auth.Config = {};
  if (typeof parsed.redirect === "string" && parsed.redirect.length > 0) {
    uiConfig.signInSuccessUrl = parsed.redirect;
  }

  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  const [continued, setContinued] = useState(false);
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
              Set up {name} on your Google Cloud or Firebase project with a
              one-click deploy button.
              <br />
              <br />
              We have no access to your data and it always stays on your
              project.
            </>
          }
        >
          <SwitchTransition mode="out-in">
            {!continued ? (
              <Grow key="notContinued">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setContinued(true)}
                >
                  Continue
                </Button>
              </Grow>
            ) : (
              <Collapse key="continued">
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
                            onChange={(e) =>
                              setConfirmProject(e.target.checked)
                            }
                          />
                        }
                        label="A Google Cloud or Firebase project"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={confirmFirestore}
                            onChange={(e) =>
                              setConfirmFirestore(e.target.checked)
                            }
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
                      href={WIKI_LINKS.setupFirebaseProject}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      step-by-step guide
                    </Link>{" "}
                    to get started.
                  </Typography>

                  <div style={{ margin: "1rem 0", textAlign: "center" }}>
                    {confirmProject && confirmFirestore && confirmAuth ? (
                      <a
                        href={EXTERNAL_LINKS.rowyRunDeploy}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="https://deploy.cloud.run/button.svg"
                          alt="Run on Google Cloud"
                          style={{ display: "block", margin: "0 auto" }}
                          width={183}
                          height={32}
                        />
                      </a>
                    ) : (
                      <img
                        src="https://deploy.cloud.run/button.svg"
                        alt="Run on Google Cloud"
                        style={{
                          display: "block",
                          filter: "grayscale(1)",
                          opacity: 0.6,
                          margin: "0 auto",
                        }}
                        width={183}
                        height={32}
                      />
                    )}
                  </div>

                  <Typography variant="caption" color="text.secondary">
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
                </>
              </Collapse>
            )}
          </SwitchTransition>
        </AuthLayout>
      </div>
    </Stack>
  );
}
