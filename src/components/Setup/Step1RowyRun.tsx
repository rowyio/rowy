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
  const { pathname } = useLocation();
  const history = useHistory();

  const [isValidRowyRunUrl, setIsValidRowyRunUrl] = useState(
    completion.rowyRun
  );
  const [isLatestVersion, setIsLatestVersion] = useState(completion.rowyRun);

  const [rowyRunUrl, setRowyRunUrl] = useState(paramsRowyRunUrl);
  const [latestVersion, setLatestVersion] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "pass" | "fail"
  >("idle");

  const verifyRowyRun = async () => {
    setVerificationStatus("loading");

    try {
      const result = await checkCompletionRowyRun(rowyRunUrl);
      setVerificationStatus("pass");

      if (result.isValidRowyRunUrl) setIsValidRowyRunUrl(true);

      setLatestVersion(result.latestVersion);

      if (result.isLatestVersion) {
        setIsLatestVersion(true);
        setCompletion((c) => ({ ...c, rowyRun: true }));
        history.replace({
          pathname,
          search: queryString.stringify({ rowyRunUrl }),
        });
      }
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
                  onClick={verifyRowyRun}
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
              ? latestVersion
                ? `Rowy Run is up to date: ${latestVersion}`
                : "Rowy Run is up to date."
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
                onClick={verifyRowyRun}
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

export const checkCompletionRowyRun = async (rowyRunUrl: string) => {
  const result = {
    isValidRowyRunUrl: false,
    isLatestVersion: false,
    latestVersion: "",
  };

  const req = await fetch(rowyRunUrl + RunRoutes.version.path, {
    method: RunRoutes.version.method,
  });
  if (!req.ok) return result;
  const res = await req.json();
  if (!res.version) return result;

  result.isValidRowyRunUrl = true;

  // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
  const endpoint =
    runRepoUrl.replace("github.com", "api.github.com/repos") +
    "/releases/latest";
  const latestVersionReq = await fetch(endpoint, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  const latestVersion = await latestVersionReq.json();
  if (!latestVersion.tag_name) return result;

  if (latestVersion.tag_name > "v" + res.version) {
    result.isLatestVersion = false;
    result.latestVersion = latestVersion.tag_name;
  } else {
    result.isLatestVersion = true;
    result.latestVersion = res.version;
  }

  return result;
};
