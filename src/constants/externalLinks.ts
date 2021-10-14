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
  setup: "/setup/install",
  setupFirebaseProject: "/setup/firebase-project",
  setupRoles: "/setup/roles",
  setupUpdate: "/setup/update",

  howToCreateTable: "/how-to/create-table",
  howToCreateColumn: "/how-to/create-column",
  howToAddRow: "/how-to/add-row",
  howToDefaultValues: "/how-to/default-values",
  howToCustomViews: "/how-to/custom-views",

  fieldTypesSupportedFields: "/field-types/supported-fields",
  fieldTypesDerivative: "/field-types/derivative",
  fieldTypesConnectTable: "/field-types/connect-table",
  fieldTypesAdd: "/field-types/add",

  rowyRun: "/rowy-run",

  extensions: "/extensions",
  extensionsDocSync: "/extensions/doc-sync",
  extensionsAlgoliaIndex: "/extensions/algolia-index",
  extensionsSlackMessage: "/extensions/slack-message",
  extensionsSendgridEmail: "/extensions/sendgrid-email",
  extensionsTwilioMessage: "/extensions/twilio-message",
};
export const WIKI_LINKS = _mapValues(
  WIKI_PATHS,
  (path) => EXTERNAL_LINKS.docs + path
);
