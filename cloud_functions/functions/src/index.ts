export { triggerCloudBuild } from "./buildTriggers"; // a callable used for triggering cloudbuild to build and deploy configurable cloud functions
export { scheduledFirestoreBackup, callableFirestoreBackup } from "./backup";
import * as callableFns from "./callable";
export const callable = callableFns;

// all the cloud functions bellow are deployed using the triggerCloudBuild callable  function
// these functions are designed to be built and deployed based on the configuration passed through the callable
import config from "./functionConfig"; // generated using generateConfig.ts
import algoliaFnsGenerator from "./algolia"; // algolia sync functions template
import collectionSyncFnsGenerator from "./collectionSync";
import snapshotSyncFnsGenerator from "./snapshotSync";
import collectionSnapshotFnsGenerator from "./history";
import permissionControlFnsGenerator from "./permissions";

const functionConfig: any = config;

export const FT_algolia = {
  [functionConfig.name]: { ...algoliaFnsGenerator(functionConfig) },
};

// {
//   [functionConfig.name]: { ...algoliaFnsGenerator(functionConfig) },
// };

export const FT_sync = {
  [`${`${`${functionConfig.source}`
    .replace(/\//g, "_")
    .replace(/_{.*?}_/g, "_")}`}2${`${`${functionConfig.target}`
    .replace(/\//g, "_")
    .replace(/_{.*?}_/g, "_")}`}`]: collectionSyncFnsGenerator(functionConfig),
};

export const FT_history = {
  [functionConfig.name
    .replace(/\//g, "_")
    .replace(/_{.*?}_/g, "_")]: collectionSnapshotFnsGenerator(functionConfig),
};

export const FT_permissions = {
  [functionConfig.name]: permissionControlFnsGenerator(functionConfig),
};

export const FT_snapshotSync = functionConfig.fnName
  ? { [functionConfig.fnName]: snapshotSyncFnsGenerator(functionConfig) }
  : {
      [`${`${`${functionConfig.source}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}2${`${`${functionConfig.target}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}`]: snapshotSyncFnsGenerator(
        functionConfig
      ),
    };
