import { useState } from "react";

import {
  Typography,
  Link,
  Divider,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { IProjectSettingsChildProps } from "@src/pages/Settings/ProjectSettings";
import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";
import useUpdateCheck from "@src/hooks/useUpdateCheck";
import { name } from "@root/package.json";
import { runRoutes } from "@src/constants/runRoutes";

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

        // If the deployed version is different from the last update check,
        // check for updates again to clear update
        if (versionReq.version !== latestUpdate.deployedRowyRun)
          checkForUpdates();

        updateSettings({ rowyRunUrl: inputRowyRunUrl });
      }
    } catch (e) {
      console.error(e);
      setVerified(false);
    }
  };

  const [latestUpdate, checkForUpdates, loading] = useUpdateCheck();

  const deployButton = window.location.hostname.includes(
    EXTERNAL_LINKS.rowyAppHostName
  ) ? (
    settings.rowyRunDeployStatus === "BUILDING" ||
    settings.rowyRunDeployStatus === "COMPLETE" ? (
      <LoadingButton
        variant="contained"
        loading
        loadingIndicator={
          settings.rowyRunDeployStatus === "COMPLETE" ? "Deployed" : undefined
        }
        style={{ width: 183, borderRadius: 12 }}
      >
        Run on Google Cloud
      </LoadingButton>
    ) : (
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
    )
  ) : (
    <Button href={WIKI_LINKS.rowyRun} target="_blank" rel="noopener noreferrer">
      Deploy instructions
    </Button>
  );

  return (
    <>
      <Typography>
        {name} Run is a Cloud Run instance that provides backend functionality,
        such as table action scripts, user management, and easy Cloud Function
        deployment.{" "}
        <Link
          href={WIKI_LINKS.rowyRun}
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
              {loading ? (
                <Typography display="block">Checking for updates…</Typography>
              ) : latestUpdate.rowyRun === null ? (
                <Typography display="block">Up to date</Typography>
              ) : (
                <Typography display="block">
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#f00",
                      borderRadius: "50%",
                      width: 10,
                      height: 10,
                      marginRight: 4,
                    }}
                  />
                  Update available:{" "}
                  <Link
                    href={latestUpdate.rowyRun.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {latestUpdate.rowyRun.tag_name}
                    <InlineOpenInNewIcon />
                  </Link>
                </Typography>
              )}

              <Typography display="block" color="textSecondary">
                {name} Run v{latestUpdate.deployedRowyRun}
              </Typography>
            </Grid>

            <Grid item>
              {latestUpdate.rowyRun === null ? (
                <LoadingButton onClick={checkForUpdates} loading={loading}>
                  Check for updates
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
              label="Cloud Run instance URL"
              id="rowyRunUrl"
              value={inputRowyRunUrl}
              onChange={(e) => setInputRowyRunUrl(e.target.value)}
              fullWidth
              placeholder="https://<id>.run.app"
              type="url"
              autoComplete="url"
              error={verified === false}
              helperText={
                verified === true ? (
                  <>
                    <CheckCircleIcon
                      color="success"
                      style={{ fontSize: "1rem", verticalAlign: "text-top" }}
                    />
                    &nbsp;
                    {name} Run is set up correctly
                  </>
                ) : verified === false ? (
                  `${name} Run is not set up correctly`
                ) : (
                  " "
                )
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
