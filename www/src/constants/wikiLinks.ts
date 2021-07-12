import _mapValues from "lodash/mapValues";
import meta from "../../package.json";

const WIKI_PATHS = {
  updatingFiretable: "/Updating-Firetable",
  derivatives: "/Derivatives",
  defaultValues: "/Default-Values",
  cloudRunFtBuilder: "/Setting-up-cloud-Run-FT-Builder",
  securityRules: "/Role-Based-Security-Rules",
  setUpAuth: "/Set-Up-Firebase-Authentication",
};

const WIKI_LINK_ROOT = meta.repository.url.replace(".git", "/wiki");

export const WIKI_LINKS = _mapValues(
  WIKI_PATHS,
  (path) => WIKI_LINK_ROOT + path
);
export default WIKI_LINKS;
