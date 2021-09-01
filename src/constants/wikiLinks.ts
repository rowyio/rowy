import _mapValues from "lodash/mapValues";
import meta from "../../package.json";

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
export default WIKI_LINKS;
