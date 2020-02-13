import algoliaFnsGenerator from "./algolia";
import algoliaConfig from "./algolia/algoliaConfig";
import collectionSyncFnsGenerator from "./collectionSync";
import collectionSyncConfig from "./collectionSync/config";

import collectionSnapshotFnsGenerator from "./history";
import collectionHistoryConfig from "./history/config";

export { exportTable } from "./export";
import * as callableFns from "./callable";
export const callable = callableFns;
export const algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});

export const sync = collectionSyncConfig.reduce((acc: any, collection) => {
  return {
    ...acc,
    [`${collection.source}2${collection.target}`]: collectionSyncFnsGenerator(
      collection
    ),
  };
}, {});

export const history = collectionHistoryConfig.reduce(
  (acc: any, collection) => {
    return {
      ...acc,
      [collection.name]: collectionSnapshotFnsGenerator(collection),
    };
  },
  {}
);
