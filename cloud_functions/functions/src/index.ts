import algoliaFnsGenerator from "./algolia";
import algoliaConfig from "./algolia/algoliaConfig";
export { exportTable } from "./export";
import * as callableFns from "./callable";
export const callable = callableFns;
export const algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});
