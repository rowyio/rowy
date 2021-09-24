import _mapValues from "lodash/mapValues";
import meta from "@root/package.json";

export const EXTERNAL_LINKS = {
  homepage: meta.homepage,
  privacy: meta.homepage + "/privacy",
  terms: meta.homepage + "/terms",
  docs: meta.homepage.replace("//", "//docs."),

  gitHub: meta.repository.url.replace(".git", ""),
  discord: "https://discord.gg/B8yAD5PDX4",
  twitter: "https://twitter.com/rowyio",

  rowyRun: meta.repository.url.replace(".git", "Run"),
  rowyRunGitHub: meta.repository.url.replace(".git", "Run"),
  // prettier-ignore
  rowyRunDeploy: `https://deploy.cloud.run/?git_repo=${meta.repository.url.replace(".git", "Run")}.git`,
  rowyRunDocs: meta.homepage.replace("//", "//docs.") + "/rowyRun",

  rowyAppHostName: "rowy.app",

  dateFormat: "https://date-fns.org/v2.24.0/docs/format",
};

const WIKI_PATHS = {
  updating: "/Updating",
  derivatives: "/field-types/derivative",
  defaultValues: "/Default-Values",
  functions: "/Cloud-Functions",
  securityRules: "/Role-Based-Security-Rules",
  setUpAuth: "/Setting-Up-Firebase-Authentication",
  extensions: "/Extensions",
};
export const WIKI_LINKS = _mapValues(
  WIKI_PATHS,
  (path) => EXTERNAL_LINKS.docs + path
);
