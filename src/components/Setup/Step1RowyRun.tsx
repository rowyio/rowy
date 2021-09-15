import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { ISetupStepBodyProps } from "pages/Setup";

import { Button, Typography, Stack, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import SetupItem from "./SetupItem";

import { runRepoUrl, RunRoutes } from "constants/runRoutes";

export default function Step1RowyRun({
  completion,
  setCompletion,
  rowyRunUrl: paramsRowyRunUrl,
}: ISetupStepBodyProps) {
  const history = useHistory();
  const { pathname } = useLocation();

  const [isValidRowyRunUrl, setIsValidRowyRunUrl] = useState(false);
  const [isLatestVersion, setIsLatestVersion] = useState(false);

  const [rowyRunUrl, setRowyRunUrl] = useState(paramsRowyRunUrl);
  const [latestVersion, setLatestVersion] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "pass" | "fail"
  >("idle");
  const verifyRowyRunUrl = async () => {
    setVerificationStatus("loading");
    try {
      const req = await fetch(rowyRunUrl + RunRoutes.version.path, {
        method: RunRoutes.version.method,
      });
      if (!req.ok) throw new Error("Request failed");
      const res = await req.json();
      if (!res.version) throw new Error("Invalid response");

      // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
      const endpoint =
        runRepoUrl.replace("github.com", "api.github.com/repos") +
        "/releases/latest";
      const latestVersionReq = await fetch(endpoint, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      const latestVersion = await latestVersionReq.json();
      if (!latestVersion.tag_name) throw new Error("No releases");

      if (latestVersion.tag_name > "v" + res.version) {
        setVerificationStatus("pass");
        setIsLatestVersion(false);
        setLatestVersion(latestVersion.tag_name);
      } else {
        setVerificationStatus("pass");
        setIsLatestVersion(true);
        setLatestVersion("v" + res.version);
        setCompletion((c) => ({ ...c, rowyRun: true }));
      }

      setIsValidRowyRunUrl(true);
      history.replace({
        pathname,
        search: queryString.stringify({ rowyRunUrl }),
      });
    } catch (e: any) {
      console.error(`Failed to verify Rowy Run URL: ${e.message}`);
      setVerificationStatus("fail");
    }
  };

  useEffect(() => {
    if (!isValidRowyRunUrl && paramsRowyRunUrl) console.log(paramsRowyRunUrl);
  }, [paramsRowyRunUrl, isValidRowyRunUrl]);

  const deployButton = window.location.hostname.includes("rowy.app") ? (
    <Button
      href={`https://deploy.cloud.run/?git_repo=${runRepoUrl}.git`}
      target="_blank"
      rel="noopener noreferrer"
      endIcon={<OpenInNewIcon />}
    >
      One-Click Deploy
    </Button>
  ) : (
    <Button
      href={runRepoUrl}
      target="_blank"
      rel="noopener noreferrer"
      endIcon={<OpenInNewIcon />}
    >
      Deploy Instructions
    </Button>
  );

  return (
    <>
      <SetupItem
        status={isValidRowyRunUrl ? "complete" : "incomplete"}
        title={
          isValidRowyRunUrl
            ? `Rowy Run is set up at: ${rowyRunUrl}`
            : "Deploy Rowy Run to your GCP project."
        }
      >
        {!isValidRowyRunUrl && (
          <>
            {deployButton}

            <div>
              <Typography variant="inherit" gutterBottom>
                Then paste the Rowy Run instance URL below:
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                style={{ width: "100%" }}
              >
                <TextField
                  id="rowyRunUrl"
                  label="Rowy Run Instance URL"
                  placeholder="https://*.run.app"
                  value={rowyRunUrl}
                  onChange={(e) => setRowyRunUrl(e.target.value)}
                  type="url"
                  autoComplete="url"
                  fullWidth
                  error={verificationStatus === "fail"}
                  helperText={
                    verificationStatus === "fail" ? "Invalid URL" : " "
                  }
                />
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={verificationStatus === "loading"}
                  onClick={verifyRowyRunUrl}
                >
                  Verify
                </LoadingButton>
              </Stack>
            </div>
          </>
        )}
      </SetupItem>

      {isValidRowyRunUrl && (
        <SetupItem
          status={isLatestVersion ? "complete" : "incomplete"}
          title={
            isLatestVersion
              ? `Rowy Run is up to date: ${latestVersion}`
              : `Update your Rowy Run instance. Latest version: ${latestVersion}`
          }
        >
          {!isLatestVersion && (
            <Stack direction="row" spacing={1} alignItems="center">
              {deployButton}
              <LoadingButton
                variant="contained"
                color="primary"
                loading={verificationStatus === "loading"}
                onClick={verifyRowyRunUrl}
              >
                Verify
              </LoadingButton>
            </Stack>
          )}
        </SetupItem>
      )}
    </>
  );
}
