import { useState, useCallback, useEffect } from "react";
import createPersistedState from "use-persisted-state";
import { differenceInDays } from "date-fns";

import { Grid, Typography, Button, Link, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import Logo from "assets/Logo";
import InlineOpenInNewIcon from "components/InlineOpenInNewIcon";

import { name, version, repository } from "@root/package.json";
import { projectId } from "@src/firebase";
import WIKI_LINKS from "constants/wikiLinks";

const useLastCheckedUpdateState = createPersistedState(
  "__ROWY__LAST_CHECKED_UPDATE"
);
export const useLatestUpdateState = createPersistedState(
  "__ROWY__LATEST_UPDATE"
);

export default function About() {
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
      const res = await fetch(endpoint, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });
      const json = await res.json();

      if (json.tag_name > "v" + version) {
        setLatestUpdate(json);
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
        <Grid container justifyContent="center" spacing={3}>
          <Grid item>
            <Link
              variant="body2"
              href={repository.url.replace(".git", "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <InlineOpenInNewIcon />
            </Link>
          </Grid>

          <Grid item>
            <Link
              variant="body2"
              // href={repository.url.replace(".git", "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
              <InlineOpenInNewIcon />
            </Link>
          </Grid>

          <Grid item>
            <Link
              variant="body2"
              // href={repository.url.replace(".git", "")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
              <InlineOpenInNewIcon />
            </Link>
          </Grid>
        </Grid>
      </div>

      <Divider />

      <div>
        <Grid container spacing={1} alignItems="center" direction="row">
          <Grid item xs>
            <Typography display="block">
              {name} v{version}
            </Typography>
            {latestUpdate === null ? (
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
              <Button
                href={WIKI_LINKS.updating}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={
                  <InlineOpenInNewIcon sx={{ fontSize: "18px !important" }} />
                }
              >
                How to Update
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
            <Typography>Firebase Project: {projectId}</Typography>
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
