import _mapValues from "lodash/mapValues";
import meta from "@root/package.json";

const WIKI_PATHS = {
  updating: "/Updating",
  derivatives: "/Derivative-Fields",
  defaultValues: "/Default-Values",
  functions: "/Cloud-Functions",
  securityRules: "/Role-Based-Security-Rules",
  setUpAuth: "/Setting-Up-Firebase-Authentication",
  extensions: "/Extensions",
};
const WIKI_LINK_ROOT = meta.repository.url.replace(".git", "/wiki");
export const WIKI_LINKS = _mapValues(
  WIKI_PATHS,
  (path) => WIKI_LINK_ROOT + path
);

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
};
