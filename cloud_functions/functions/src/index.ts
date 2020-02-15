import algoliaFnsGenerator from "./algolia";
import * as algoliaConfig from "./algolia/config.json";
import collectionSyncFnsGenerator from "./collectionSync";
import * as collectionSyncConfig from "./collectionSync/config.json";

import collectionSnapshotFnsGenerator from "./history";

import * as collectionHistoryConfig from "./history/config.json";
import permissionControlFnsGenerator from "./permissions";
import * as permissionsConfig from "./permissions/config.json";

export { exportTable } from "./export";
import * as callableFns from "./callable";

export const callable = callableFns;
export const FT_algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});

export const FT_sync = collectionSyncConfig.reduce((acc: any, collection) => {
  return {
    ...acc,
    [`${collection.source}2${collection.target}`]: collectionSyncFnsGenerator(
      collection
    ),
  };
}, {});

export const FT_history = collectionHistoryConfig.reduce(
  (acc: any, collection) => {
    return {
      ...acc,
      [collection.name]: collectionSnapshotFnsGenerator(collection),
    };
  },
  {}
);

export const FT_permissions = permissionsConfig.reduce(
  (acc: any, collection) => {
    return {
      ...acc,
      [collection.name]: permissionControlFnsGenerator(collection),
    };
  },
  {}
);
