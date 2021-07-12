import meta from "../../package.json";

const WIKI_LINK_ROOT = meta.repository.url.replace(".git", "/wiki/");

export const WIKI_LINKS = {
  updatingFiretable: WIKI_LINK_ROOT + "Updating-Firetable",
};

export default WIKI_LINKS;
