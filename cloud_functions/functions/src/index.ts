import algoliaFnsGenerator from "./algolia";
import * as algoliaConfig from "./algolia/config.json";
import collectionSyncFnsGenerator from "./collectionSync";
import * as collectionSyncConfig from "./collectionSync/config.json";

import collectionSnapshotFnsGenerator from "./history";
import * as collectionHistoryConfig from "./history/config.json";

export { exportTable } from "./export";
import * as callableFns from "./callable";
const callable = callableFns;
const algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});

const sync = collectionSyncConfig.reduce((acc: any, collection) => {
  return {
    ...acc,
    [`${collection.source}2${collection.target}`]: collectionSyncFnsGenerator(
      collection
    ),
  };
}, {});

const history = collectionHistoryConfig.reduce((acc: any, collection) => {
  return {
    ...acc,
    [collection.name]: collectionSnapshotFnsGenerator(collection),
  };
}, {});

export const FIRETABLE = { callable, algolia, sync, history };
