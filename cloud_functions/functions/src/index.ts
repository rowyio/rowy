export { exportTable } from "./export";
import algoliaFnsGenerator from "./algolia";
import algoliaConfig from "./algolia/algoliaConfig";
export const algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});
