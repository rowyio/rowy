import { useState, useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { differenceInDays } from "date-fns";
import { compare } from "compare-versions";

import {
  projectScope,
  rowyRunAtom,
  rowyRunLatestUpdateAtom,
} from "@src/atoms/projectScope";
import meta from "@root/package.json";
import { EXTERNAL_LINKS } from "@src/constants/externalLinks";
import { runRoutes } from "@src/constants/runRoutes";

// https://docs.github.com/en/rest/reference/repos#get-the-latest-release
const UPDATE_ENDPOINTS = {
  rowy: meta.repository.url
    .replace("github.com", "api.github.com/repos")
    .replace(/.git$/, "/releases/latest"),

  rowyRun:
    EXTERNAL_LINKS.rowyRunGitHub.replace("github.com", "api.github.com/repos") +
    "/releases/latest",
};

/**
 * Get the latest version of Rowy and Rowy Run from GitHub releases,
 * and the currently deployed versions
 * @returns [latestUpdate, checkForUpdates, loading]
 */
export default function useUpdateCheck() {
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  // Store latest release from GitHub
  const [latestUpdate, setLatestUpdate] = useAtom(
    rowyRunLatestUpdateAtom,
    projectScope
  );
  const [loading, setLoading] = useState(false);

  // Check for updates using latest releases from GitHub
  const checkForUpdates = useCallback(async () => {
    setLoading(true);

    const newState = {
      lastChecked: new Date().toISOString(),
      rowy: null,
      rowyRun: null,
      deployedRowy: meta.version,
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
    if (compare(resRowy.tag_name, meta.version, ">")) newState.rowy = resRowy;
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
      latestUpdate.deployedRowy !== meta.version
    )
      checkForUpdates();
  }, [latestUpdate, loading, checkForUpdates]);

  return [latestUpdate, checkForUpdates, loading] as const;
}
