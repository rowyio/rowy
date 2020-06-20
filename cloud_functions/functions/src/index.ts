const algoliaConfig = requireConfig("./algolia/config.json");
const collectionHistoryConfig = requireConfig("./history/config.json");
const snapshotSyncConfig = requireConfig("./snapshotSync/config.json");
const collectionSyncConfig = requireConfig("./collectionSync/config.json");
const permissionsConfig = requireConfig("./permissions/config.json");
function requireConfig(module) {
  //trys to import config json
  try {
    return require(module);
  } catch (error) {
    // if there's no config it'll return an empty array
    return [];
  }
}
export { exportTable } from "./export";

import algoliaFnsGenerator from "./algolia";
import collectionSyncFnsGenerator from "./collectionSync";

import snapshotSyncFnsGenerator from "./snapshotSync";

import collectionSnapshotFnsGenerator from "./history";

import permissionControlFnsGenerator from "./permissions";

export { triggerCloudBuild } from "./buildTriggers";
export { scheduledFirestoreBackup, callableFirestoreBackup } from "./backup";
import * as callableFns from "./callable";

export const callable = callableFns;
export const FT_algolia = algoliaConfig.reduce((acc: any, collection: any) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});

export const FT_sync = collectionSyncConfig.reduce(
  (acc: any, collection: any) => {
    return {
      ...acc,
      [`${`${`${collection.source}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}2${`${`${collection.target}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}`]: collectionSyncFnsGenerator(collection),
    };
  },
  {}
);
export const FT_snapshotSync = snapshotSyncConfig.reduce(
  (acc: any, collection: any) => {
    if (collection.fnName) {
      return {
        ...acc,
        [collection.fnName]: snapshotSyncFnsGenerator(collection),
      };
    } else
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
  (acc: any, collection: any) => {
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
  (acc: any, collection: any) => {
    return {
      ...acc,
      [collection.name]: permissionControlFnsGenerator(collection),
    };
  },
  {}
);
