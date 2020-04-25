import algoliaFnsGenerator from "./algolia";
import * as algoliaConfig from "./algolia/config.json";
import collectionSyncFnsGenerator from "./collectionSync";
import * as collectionSyncConfig from "./collectionSync/config.json";

import snapshotSyncFnsGenerator from "./snapshotSync";
import * as snapshotSyncConfig from "./snapshotSync/config.json";

import collectionSnapshotFnsGenerator from "./history";

import * as collectionHistoryConfig from "./history/config.json";
import permissionControlFnsGenerator from "./permissions";
import * as permissionsConfig from "./permissions/config.json";

import synonymsFnsGenerator from "./synonyms";
import synonymsConfig from "./synonyms/config";

export { exportTable } from "./export";
export { triggerCloudBuild } from "./buildTriggers";
import * as callableFns from "./callable";

export const callable = callableFns;
export const FT_algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});

export const FT_sync = collectionSyncConfig.reduce((acc: any, collection) => {
  return {
    ...acc,
    [`${`${`${collection.source}`
      .replace(/\//g, "_")
      .replace(/_{.*?}_/g, "_")}`}2${`${`${collection.target}`
      .replace(/\//g, "_")
      .replace(/_{.*?}_/g, "_")}`}`]: collectionSyncFnsGenerator(collection),
  };
}, {});
export const FT_snapshotSync = snapshotSyncConfig.reduce(
  (acc: any, collection) => {
    return {
      ...acc,
      [`${`${`${collection.source}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}2${`${`${collection.target}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}`]: snapshotSyncFnsGenerator(collection),
    };
  },
  {}
);

export const FT_history = collectionHistoryConfig.reduce(
  (acc: any, collection) => {
    return {
      ...acc,
      [collection.name
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")]: collectionSnapshotFnsGenerator(collection),
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

export const FT_synonyms = synonymsConfig.reduce((acc: any, collection) => {
  return {
    ...acc,
    [collection.name
      .replace(/\//g, "_")
      .replace(/_{.*?}_/g, "_")]: synonymsFnsGenerator(collection),
  };
}, {});
