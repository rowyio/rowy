import { useState, useCallback, useEffect } from "react";
import createPersistedState from "use-persisted-state";
import { differenceInDays } from "date-fns";
import { compare } from "compare-versions";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { repository, version } from "@root/package.json";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import { runRoutes } from "@src/constants/runRoutes";

// https://docs.github.com/en/rest/reference/repos#get-the-latest-release
const UPDATE_ENDPOINTS = {
  rowy: repository.url
    .replace("github.com", "api.github.com/repos")
    .replace(/.git$/, "/releases/latest"),

  rowyRun:
    EXTERNAL_LINKS.rowyRunGitHub.replace("github.com", "api.github.com/repos") +
    "/releases/latest",
};

export const useLatestUpdateState = createPersistedState(
  "__ROWY__UPDATE_CHECK"
);
type LatestUpdateState = {
  lastChecked: string;
  rowy: null | Record<string, any>;
  rowyRun: null | Record<string, any>;
  deployedRowy: string;
  deployedRowyRun: string;
};

/**
 * Get the latest version of Rowy and Rowy Run from GitHub releases,
 * and the currently deployed versions
 * @returns [latestUpdate, checkForUpdates, loading]
 */
export default function useUpdateCheck() {
  const { rowyRun } = useProjectContext();
  const [loading, setLoading] = useState(false);

  // Store latest release from GitHub
  const [latestUpdate, setLatestUpdate] =
    useLatestUpdateState<LatestUpdateState>({
      lastChecked: "",
      rowy: null,
      rowyRun: null,
      deployedRowy: version,
      deployedRowyRun: "",
    });

  // Check for updates using latest releases from GitHub
  const checkForUpdates = useCallback(async () => {
    if (!rowyRun) return;
    setLoading(true);

    const newState = {
      lastChecked: new Date().toISOString(),
      rowy: null,
      rowyRun: null,
      deployedRowy: version,
      deployedRowyRun: "",
    };

    // Make all requests simultaneously
    const [resRowy, resRowyRun, deployedRowyRun] = await Promise.all([
      fetch(UPDATE_ENDPOINTS.rowy, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).then((r) => r.json()),
      fetch(UPDATE_ENDPOINTS.rowyRun, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }).then((r) => r.json()),
      rowyRun({ route: runRoutes.version }),
    ]);

    // Only store the latest release
    if (compare(resRowy.tag_name, version, ">")) newState.rowy = resRowy;
    if (
      deployedRowyRun &&
      compare(resRowyRun.tag_name, deployedRowyRun.version, ">")
    )
      newState.rowyRun = resRowyRun;

    // Save deployed version
    newState.deployedRowyRun = deployedRowyRun?.version ?? "";

    setLatestUpdate(newState);
    setLoading(false);
  }, [setLoading, setLatestUpdate, rowyRun]);

  // Check for new updates on page load if last check was more than 7 days ago
  // or if deployed version has changed
  useEffect(() => {
    if (loading) return;

    if (
      !latestUpdate.lastChecked ||
      differenceInDays(new Date(), new Date(latestUpdate.lastChecked)) > 7 ||
      latestUpdate.deployedRowy !== version
    )
      checkForUpdates();
  }, [latestUpdate, loading, checkForUpdates]);

  return [latestUpdate, checkForUpdates, loading] as const;
}
