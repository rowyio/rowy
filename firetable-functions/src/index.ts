import algoliaFnsGenerator, { AlgoliaConfig } from "./algolia";
import collectionSyncFnsGenerator, { CollectionSyncConfig } from "./collectionSync";
import collectionSnapshotFnsGenerator, { CollectionHistoryConfig } from "./history";
import permissionControlFnsGenerator, { PermissionsConfig } from "./permissions";
import synonymsFnsGenerator, { SynonymConfig } from "./synonyms";

import { exportTableCallable } from "./export";
import { sendEmailTemplateCallable } from "./callable";

// Hack to get the compiler not to emit functions.Requests as generic following express-serve-static-core

import * as functions from "firebase-functions";
type FirebaseHttpsFunction = functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;

export interface FiretableConfig {
  algolia?: AlgoliaConfig[];
  sync?: CollectionSyncConfig[];
  history?: CollectionHistoryConfig[];
  synonyms?: SynonymConfig[];
  permissions?: PermissionsConfig[];
}

export default function(config: FiretableConfig = {}) {

  const exportTable: FirebaseHttpsFunction = functions.https.onCall(exportTableCallable)
  const sendEmail: FirebaseHttpsFunction = functions.https.onCall(sendEmailTemplateCallable);

  const algolia = (config.algolia || []).reduce((acc: any, collection) => {
    return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
  }, {});


  const sync = (config.sync || []).reduce((acc: any, collection: CollectionSyncConfig) => {
    return {
      ...acc,
      [`${`${`${collection.source}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}2${`${`${collection.target}`
          .replace(/\//g, "_")
          .replace(/_{.*?}_/g, "_")}`}`]: collectionSyncFnsGenerator(collection),
    };
  }, {});

  const history = (config.history || []).reduce(
    (acc: any, collection: CollectionHistoryConfig) => {
      return {
        ...acc,
        [collection.name
          .replace(/\//g, "_")
          .replace(/_{.*?}_/g, "_")]: collectionSnapshotFnsGenerator(collection),
      };
    },
    {}
  );
  
  const permissions = (config.permissions || []).reduce(
    (acc: any, collection) => {
      return {
        ...acc,
        [collection.name]: permissionControlFnsGenerator(collection),
      };
    },
    {}
  );


  const synonyms = (config.synonyms || []).reduce((acc: any, collection: SynonymConfig) => {
    return {
      ...acc,
      [collection.name
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")]: synonymsFnsGenerator(collection),
    };
  }, {});

  return {
    exportTable,
    sendEmail,
    algolia,
    sync,
    history,
    permissions,
    synonyms,
  }
}
