import { useState, useCallback, useEffect } from "react";
import createPersistedState from "use-persisted-state";
import { differenceInDays } from "date-fns";

import {
  Typography,
  Link,
  Divider,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import { IProjectSettingsChildProps } from "pages/Settings/ProjectSettings";
import WIKI_LINKS from "constants/wikiLinks";
import { name } from "@root/package.json";
import { runRoutes, runRepoUrl } from "constants/runRoutes";

const useLastCheckedUpdateState = createPersistedState(
  "__ROWY__RUN_LAST_CHECKED_UPDATE"
);
export const useLatestUpdateState = createPersistedState(
  "__ROWY__RUN_LATEST_UPDATE"
);

export default function RowyRun({
  settings,
  updateSettings,
}: IProjectSettingsChildProps) {
  const [inputRowyRunUrl, setInputRowyRunUrl] = useState(settings.rowyRunUrl);
  const [verified, setVerified] = useState<boolean | "LOADING" | undefined>();
  const handleVerify = async () => {
    setVerified("LOADING");
    try {
      const versionReq = await fetch(inputRowyRunUrl + runRoutes.version.path, {
        method: runRoutes.version.method,
      }).then((res) => res.json());

      if (!versionReq.version) throw new Error("No version found");
      else {
        setVerified(true);
        setVersion(versionReq.version);
        updateSettings({ rowyRunUrl: inputRowyRunUrl });
      }
    } catch (e) {
      console.error(e);
      setVerified(false);
    }
  };

  const [lastCheckedUpdate, setLastCheckedUpdate] =
    useLastCheckedUpdateState<string>();
  const [latestUpdate, setLatestUpdate] = useLatestUpdateState<null | Record<
    string,
    any
  >>(null);

  const [checkState, setCheckState] = useState<null | "LOADING" | "NO_UPDATE">(
    null
  );
  const [version, setVersion] = useState("");
  useEffect(() => {
    fetch(settings.rowyRunUrl + runRoutes.version.path, {
      method: runRoutes.version.method,
    })
      .then((res) => res.json())
      .then((data) => setVersion(data.version));
  }, [settings.rowyRunUrl]);

  const checkForUpdate = useCallback(async () => {
    setCheckState("LOADING");

    // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
    const endpoint =
      runRepoUrl.replace("github.com", "api.github.com/repos") +
      "/releases/latest";
    try {
      const versionReq = await fetch(
        settings.rowyRunUrl + runRoutes.version.path,
        { method: runRoutes.version.method }
      ).then((res) => res.json());
      const version = versionReq.version;
      setVersion(version);

      const req = await fetch(endpoint, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });
      const res = await req.json();

      if (res.tag_name > "v" + version) {
        setLatestUpdate(res);
        setCheckState(null);
      } else {
        setCheckState("NO_UPDATE");
      }

      setLastCheckedUpdate(new Date().toISOString());
    } catch (e) {
      console.error(e);
      setLatestUpdate(null);
      setCheckState("NO_UPDATE");
    }
  }, [setLastCheckedUpdate, setLatestUpdate, settings.rowyRunUrl]);

  // Check for new updates on page load, if last check was more than 7 days ago
  useEffect(() => {
    if (!lastCheckedUpdate) checkForUpdate();
    else if (differenceInDays(new Date(), new Date(lastCheckedUpdate)) > 7)
      checkForUpdate();
  }, [lastCheckedUpdate, checkForUpdate]);

  // Verify latest update is not installed yet
  useEffect(() => {
    if (version && latestUpdate?.tag_name <= "v" + version)
      setLatestUpdate(null);
  }, [latestUpdate, setLatestUpdate, version]);

  const deployButton = window.location.hostname.includes("rowy.app") ? (
    <LoadingButton
      href={`https://deploy.cloud.run/?git_repo=${runRepoUrl}.git`}
      target="_blank"
      rel="noopener noreferrer"
      loading={
        settings.rowyRunDeployStatus === "BUILDING" ||
        settings.rowyRunDeployStatus === "COMPLETE"
      }
      loadingIndicator={
        settings.rowyRunDeployStatus === "COMPLETE" ? "Deployed" : undefined
      }
    >
      One-Click Deploy
    </LoadingButton>
  ) : (
    <Button href={runRepoUrl} target="_blank" rel="noopener noreferrer">
      Deploy Instructions
    </Button>
  );

  return (
    <>
      <Typography>
        {name} Run is a Cloud Run instance that provides back-end functionality,
        such as table action scripts, user management, and easy Cloud Function
        deployment.{" "}
        <Link
          href={WIKI_LINKS.functions}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
          <InlineOpenInNewIcon />
        </Link>
      </Typography>

      <Divider />

      {settings.rowyRunUrl && (
        <div>
          <Grid container spacing={1} alignItems="center" direction="row">
            <Grid item xs>
              <Typography display="block">
                {name} Run v{version}
              </Typography>
              {checkState === "LOADING" ? (
                <Typography color="textSecondary" display="block">
                  Checking for updates…
                </Typography>
              ) : latestUpdate === null ? (
                <Typography color="textSecondary" display="block">
                  Up to date
                </Typography>
              ) : (
                <Link
                  href={latestUpdate.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  display="block"
                >
                  Update available: {latestUpdate.tag_name}
                  <InlineOpenInNewIcon />
                </Link>
              )}
            </Grid>

            <Grid item>
              {latestUpdate === null ? (
                <LoadingButton
                  onClick={checkForUpdate}
                  loading={checkState === "LOADING"}
                >
                  Check for Updates
                </LoadingButton>
              ) : (
                deployButton
              )}
            </Grid>
          </Grid>
        </div>
      )}

      {settings.rowyRunUrl && <Divider />}

      {!settings.rowyRunUrl && (
        <div>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} sm>
              <Typography>
                If you have not yet deployed {name} Run, click this button and
                follow the prompts on Cloud Shell.
              </Typography>
            </Grid>

            <Grid item>{deployButton}</Grid>
          </Grid>
        </div>
      )}

      <div>
        <Grid container spacing={1} alignItems="center" direction="row">
          <Grid item xs>
            <TextField
              label="Cloud Run Instance URL"
              id="rowyRunUrl"
              value={inputRowyRunUrl}
              onChange={(e) => setInputRowyRunUrl(e.target.value)}
              fullWidth
              placeholder="https://<id>.run.app"
              type="url"
              autoComplete="url"
              error={verified === false}
              helperText={
                verified === true
                  ? `${name} Run is set up correctly`
                  : verified === false
                  ? `${name} Run is not set up correctly`
                  : " "
              }
            />
          </Grid>

          <Grid item>
            <LoadingButton
              loading={verified === "LOADING"}
              onClick={handleVerify}
            >
              Verify
            </LoadingButton>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
