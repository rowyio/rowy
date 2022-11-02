import { useAtom } from "jotai";

import { Grid, Typography, Button, Link, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Discord as DiscordIcon } from "@src/assets/icons";
import TwitterIcon from "@mui/icons-material/Twitter";

import Logo from "@src/assets/Logo";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import meta from "@root/package.json";
import { projectScope, projectIdAtom } from "@src/atoms/projectScope";
import useUpdateCheck from "@src/hooks/useUpdateCheck";
import { EXTERNAL_LINKS, WIKI_LINKS } from "@src/constants/externalLinks";

export default function About() {
  const [projectId] = useAtom(projectIdAtom, projectScope);

  const [latestUpdate, checkForUpdates, loading] = useUpdateCheck();

  return (
    <>
      <Logo
        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
      />

      <div style={{ marginTop: 12 }}>
        <Grid container justifyContent="center" spacing={1}>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<GitHubIcon viewBox="-1 -1 26 26" color="action" />}
              href={EXTERNAL_LINKS.gitHub}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DiscordIcon color="action" />}
              href={EXTERNAL_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<TwitterIcon color="action" />}
              href={EXTERNAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Button>
          </Grid>
        </Grid>
      </div>

      <Divider />

      <div>
        <Grid container spacing={1} alignItems="center" direction="row">
          <Grid item xs>
            {loading ? (
              <Typography display="block">Checking for updates…</Typography>
            ) : latestUpdate.rowy === null ? (
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
                  href={latestUpdate.rowy.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {latestUpdate.rowy.tag_name}
                  <InlineOpenInNewIcon />
                </Link>
              </Typography>
            )}

            <Typography display="block" color="textSecondary">
              Rowy v{meta.version}
            </Typography>
          </Grid>

          <Grid item>
            {latestUpdate.rowy === null ? (
              <LoadingButton onClick={checkForUpdates} loading={loading}>
                Check for updates
              </LoadingButton>
            ) : (
              <Button
                href={WIKI_LINKS.setupUpdate}
                target="_blank"
                rel="noopener noreferrer"
              >
                How to update
                <InlineOpenInNewIcon />
              </Button>
            )}
          </Grid>
        </Grid>
      </div>

      <Divider />

      <div>
        <Grid
          container
          spacing={1}
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography>Firebase project: {projectId}</Typography>
          </Grid>

          <Grid item>
            <Link
              href={`https://console.firebase.google.com/project/${projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="body2"
            >
              Firebase Console
              <InlineOpenInNewIcon />
            </Link>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
