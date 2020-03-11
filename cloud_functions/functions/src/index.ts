import firetableGenerator from "@gourmetpro/firetable-functions";
import { DissolveTeam, verifyFounder } from "./callable";

import * as permissionsConfig from "./permissions/config.json";
import synonymsConfig from "./synonyms/config";
import * as firetableConfig from "./firetable.json"

const {
  exportTable,
  sendEmail,
  algolia,
  sync,
  history,
  permissions,
  synonyms,
} = firetableGenerator({permissions: permissionsConfig, synonyms: synonymsConfig, ...firetableConfig});

export const callable = {
  DissolveTeam,
  verifyFounder,
  SendEmail: sendEmail
};

export {
  exportTable,
  algolia as FT_algolia,
  sync as FT_sync,
  history as FT_history,
  permissions as FT_permissions,
  synonyms as FT_synonyms
} ;
