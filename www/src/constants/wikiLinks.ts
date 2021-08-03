import _mapValues from "lodash/mapValues";
import meta from "../../package.json";

const WIKI_PATHS = {
  updatingFiretable: "/Updating-Firetable",
  derivatives: "/Derivative-Fields",
  defaultValues: "/Default-Values",
  FtFunctions: "/Firetable-Cloud-Functions",
  securityRules: "/Role-Based-Security-Rules",
  setUpAuth: "/Setting-Up-Firebase-Authentication",
};

const WIKI_LINK_ROOT = meta.repository.url.replace(".git", "/wiki");

export const WIKI_LINKS = _mapValues(
  WIKI_PATHS,
  (path) => WIKI_LINK_ROOT + path
);
export default WIKI_LINKS;
