const fs = require("fs");
function requireConfig(module) {
  //trys to import config json
  try {
    const data = JSON.parse(fs.readFileSync(module, "utf-8"));
    console.log(data);
    return data;
  } catch (error) {
    // if there's no config it'll return an empty array
    return [];
  }
}

import functionConfig from "./functionConfig";
//const algoliaConfig = require("./algolia/config.json");

const collectionHistoryConfig = requireConfig("./history/config.json");

const snapshotSyncConfig = requireConfig("./snapshotSync/config.json");
const collectionSyncConfig = requireConfig("./collectionSync/config.json");
const permissionsConfig = requireConfig("./permissions/config.json");

import algoliaFnsGenerator from "./algolia";
import collectionSyncFnsGenerator from "./collectionSync";

import snapshotSyncFnsGenerator from "./snapshotSync";
//import * as collectionHistoryConfig from "./history/config.json";
import collectionSnapshotFnsGenerator from "./history";

import permissionControlFnsGenerator from "./permissions";

export { triggerCloudBuild } from "./buildTriggers";
export { scheduledFirestoreBackup, callableFirestoreBackup } from "./backup";
import * as callableFns from "./callable";

export const callable = callableFns;
export const FT_algolia = {
  [functionConfig.name]: algoliaFnsGenerator(functionConfig),
};

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
