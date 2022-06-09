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

import LogoRowyRun from "@src/assets/LogoRowyRun";
import { IProjectSettingsChildProps } from "@src/pages/Settings/ProjectSettingsPage";
import { WIKI_LINKS } from "@src/constants/externalLinks";
import useUpdateCheck from "@src/hooks/useUpdateCheck";
import { runRoutes } from "@src/constants/runRoutes";
// import RegionSelect from "@src/components/Settings/RegionSelect";

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

  const deployButton = (
    <Button href={WIKI_LINKS.rowyRun} target="_blank" rel="noopener noreferrer">
      Deploy instructions
    </Button>
  );

  return (
    <>
      <LogoRowyRun
        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
      />

      <Typography style={{ marginTop: 8 }}>
        Rowy Run is a Cloud Run instance that provides backend functionality,
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
                Rowy Run v{latestUpdate.deployedRowyRun}
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
                If you have not yet deployed Rowy Run, click this button and
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
                    &nbsp; Rowy Run is set up correctly
                  </>
                ) : verified === false ? (
                  `Rowy Run is not set up correctly`
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

      {/* <RegionSelect
        label="Cloud Functions region"
        value={settings.region}
        onChange={(v) => updateSettings({ region: v || "" })}
        fullWidth
        TextFieldProps={{
          helperText:
            "All new deployments of Rowy Cloud Functions will be deployed to this region",
        }}
      /> */}
    </>
  );
}
