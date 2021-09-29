import { useState, useCallback, useEffect } from "react";
import createPersistedState from "use-persisted-state";
import { differenceInDays } from "date-fns";

import { Grid, Typography, Button, Link, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import DiscordIcon from "assets/icons/Discord";
import TwitterIcon from "@mui/icons-material/Twitter";

import Logo from "assets/Logo";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import { name, version, repository } from "@root/package.json";
import { useAppContext } from "contexts/AppContext";
import { EXTERNAL_LINKS, WIKI_LINKS } from "constants/externalLinks";

const useLastCheckedUpdateState = createPersistedState(
  "__ROWY__LAST_CHECKED_UPDATE"
);
export const useLatestUpdateState = createPersistedState(
  "__ROWY__LATEST_UPDATE"
);

export default function About() {
  const { projectId } = useAppContext();

  const [lastCheckedUpdate, setLastCheckedUpdate] =
    useLastCheckedUpdateState<string>();
  const [latestUpdate, setLatestUpdate] = useLatestUpdateState<null | Record<
    string,
    any
  >>(null);

  const [checkState, setCheckState] = useState<null | "LOADING" | "NO_UPDATE">(
    null
  );

  const checkForUpdate = useCallback(async () => {
    setCheckState("LOADING");

    // https://docs.github.com/en/rest/reference/repos#get-the-latest-release
    const endpoint = repository.url
      .replace("github.com", "api.github.com/repos")
      .replace(/.git$/, "/releases/latest");
    try {
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
  }, [setLastCheckedUpdate, setLatestUpdate]);

  // Check for new updates on page load, if last check was more than 7 days ago
  useEffect(() => {
    if (!lastCheckedUpdate) checkForUpdate();
    else if (differenceInDays(new Date(), new Date(lastCheckedUpdate)) > 7)
      checkForUpdate();
  }, [lastCheckedUpdate, checkForUpdate]);

  // Verify latest update is not installed yet
  useEffect(() => {
    if (latestUpdate?.tag_name <= "v" + version) setLatestUpdate(null);
  }, [latestUpdate, setLatestUpdate]);

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
            {checkState === "LOADING" ? (
              <Typography display="block">Checking for updates…</Typography>
            ) : latestUpdate === null ? (
              <Typography display="block">Up to date</Typography>
            ) : (
              <Typography display="block">
                Update available:{" "}
                <Link
                  href={latestUpdate.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {latestUpdate.tag_name}
                  <InlineOpenInNewIcon />
                </Link>
              </Typography>
            )}

            <Typography display="block" color="textSecondary">
              {name} v{version}
            </Typography>
          </Grid>

          <Grid item>
            {latestUpdate === null ? (
              <LoadingButton
                onClick={checkForUpdate}
                loading={checkState === "LOADING"}
              >
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
