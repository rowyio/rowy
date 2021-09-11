import { Typography, Link, Grid, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import { IProjectSettingsChildProps } from "pages/Settings/ProjectSettings";
import WIKI_LINKS from "constants/wikiLinks";
import { name, repository } from "@root/package.json";

export default function CloudRun({
  settings,
  updateSettings,
}: IProjectSettingsChildProps) {
  return (
    <>
      <Typography>
        {name} Run is a Cloud Run instance that deploys this project’s Cloud
        Functions.{" "}
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
              href={`https://deploy.cloud.run/?git_repo=${repository.url
                .split("/")
                .slice(0, -1)
                .join("/")}/FunctionsBuilder.git`}
              target="_blank"
              rel="noopener noreferrer"
              loading={
                settings.cloudRunDeployStatus === "BUILDING" ||
                settings.cloudRunDeployStatus === "COMPLETE"
              }
              loadingIndicator={
                settings.cloudRunDeployStatus === "COMPLETE"
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
        id="cloudRunUrl"
        defaultValue={settings.rowyRunUrl}
        onChange={(e) => updateSettings({ cloudRunUrl: e.target.value })}
        fullWidth
        placeholder="https://<id>.run.app"
        type="url"
        autoComplete="url"
      />
    </>
  );
}
