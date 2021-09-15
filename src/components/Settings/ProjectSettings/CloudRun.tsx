import { Typography, Link, Grid, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import { IProjectSettingsChildProps } from "pages/Settings/ProjectSettings";
import WIKI_LINKS from "constants/wikiLinks";
import { name } from "@root/package.json";
import { runRepoUrl } from "constants/runRoutes";

export default function rowyRun({
  settings,
  updateSettings,
}: IProjectSettingsChildProps) {
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

          <Grid item>
            <LoadingButton
              href={`https://deploy.cloud.run/?git_repo=${runRepoUrl}.git`}
              target="_blank"
              rel="noopener noreferrer"
              loading={
                settings.rowyRunDeployStatus === "BUILDING" ||
                settings.rowyRunDeployStatus === "COMPLETE"
              }
              loadingIndicator={
                settings.rowyRunDeployStatus === "COMPLETE"
                  ? "Deployed"
                  : undefined
              }
            >
              Deploy to Cloud Run
            </LoadingButton>
          </Grid>
        </Grid>
      </div>

      <TextField
        label="Cloud Run Instance URL"
        id="rowyRunUrl"
        defaultValue={settings.rowyRunUrl}
        onChange={(e) => updateSettings({ rowyRunUrl: e.target.value })}
        fullWidth
        placeholder="https://<id>.run.app"
        type="url"
        autoComplete="url"
      />
    </>
  );
}
