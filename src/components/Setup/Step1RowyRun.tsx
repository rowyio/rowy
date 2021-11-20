import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import { ISetupStepBodyProps } from "@src/pages/Setup";

import { Button, Typography, Stack, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import SetupItem from "./SetupItem";

import { name } from "@root/package.json";
import { rowyRun } from "@src/utils/rowyRun";
import { runRoutes } from "@src/constants/runRoutes";
import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";

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
    "IDLE" | "LOADING" | "FAIL"
  >("IDLE");

  const verifyRowyRun = async () => {
    setVerificationStatus("LOADING");

    try {
      const result = await checkRowyRun(rowyRunUrl);
      setVerificationStatus("IDLE");

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
      console.error(`Failed to verify Rowy Run URL: ${e}`);
      setVerificationStatus("FAIL");
    }
  };

  useEffect(() => {
    if (!isValidRowyRunUrl && paramsRowyRunUrl) console.log(paramsRowyRunUrl);
  }, [paramsRowyRunUrl, isValidRowyRunUrl]);

  const deployButton = window.location.hostname.includes(
    EXTERNAL_LINKS.rowyAppHostName
  ) ? (
    <a
      href={EXTERNAL_LINKS.rowyRunDeploy}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://deploy.cloud.run/button.svg"
        alt="Run on Google Cloud"
        width={183}
        height={32}
        style={{ display: "block" }}
      />
    </a>
  ) : (
    <Button href={WIKI_LINKS.rowyRun} target="_blank" rel="noopener noreferrer">
      Deploy instructions
      <InlineOpenInNewIcon />
    </Button>
  );

  return (
    <>
      <Typography variant="inherit">
        {name} Run is a Google Cloud Run instance that provides backend
        functionality, such as table action scripts, user management, and easy
        Cloud Function deployment.
      </Typography>

      <SetupItem
        status={isValidRowyRunUrl ? "complete" : "incomplete"}
        title={
          isValidRowyRunUrl
            ? `Rowy Run is set up at: ${rowyRunUrl}`
            : "Deploy Rowy Run to your Google Cloud project."
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
                  label="Rowy Run instance URL"
                  placeholder="https://*.run.app"
                  value={rowyRunUrl}
                  onChange={(e) => setRowyRunUrl(e.target.value)}
                  type="url"
                  autoComplete="url"
                  fullWidth
                  error={verificationStatus === "FAIL"}
                  helperText={
                    verificationStatus === "FAIL" ? "Invalid URL" : " "
                  }
                />
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loading={verificationStatus === "LOADING"}
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
                loading={verificationStatus === "LOADING"}
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

export const checkRowyRun = async (
  serviceUrl: string,
  signal?: AbortSignal
) => {
  const result = {
    isValidRowyRunUrl: false,
    isLatestVersion: false,
    latestVersion: "",
  };

  try {
    const res = await rowyRun({ serviceUrl, route: runRoutes.version, signal });
    if (!res.version) return result;

    result.isValidRowyRunUrl = true;

    // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
    const endpoint =
      EXTERNAL_LINKS.rowyRunGitHub.replace(
        "github.com",
        "api.github.com/repos"
      ) + "/releases/latest";
    const latestVersionReq = await fetch(endpoint, {
      headers: { Accept: "application/vnd.github.v3+json" },
      signal,
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
  } catch (e: any) {
    console.error(e);
  } finally {
    return result;
  }
};
