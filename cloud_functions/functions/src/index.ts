import algoliaFnsGenerator from "./algolia";
import collectionSyncFnsGenerator from "./collectionSync";
import algoliaConfig from "./algolia/algoliaConfig";
import collectionSyncConfig from "./collectionSync/config";
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
