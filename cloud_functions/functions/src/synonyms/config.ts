import * as algoliasearch from "algoliasearch";

import { env } from "../config";
const client = algoliasearch(env.algolia.app, env.algolia.key);

const generateAlgoliaKey = (fieldName: string, value: string) =>
  client.generateSecuredApiKey(
    env.algolia.search, // Make sure to use a search key
    {
      filters: `${fieldName}:${value}`,
    }
  );

const cohort2algoliaKey = (cohort: string) =>
  generateAlgoliaKey("cohort", cohort);

const cohort2region = (cohort: string) =>
  cohort.toUpperCase().replace(/\d+$/, "");

// const location2region = (location: string) => {
//   const _location = location.toUpperCase();
//   switch (_location) {
//     case "GLOBAL":
//       return _location;

//     case "SYDNEY":
//       return "SYD";
//     case "LONDON":
//       return "LON";
//     case "SINGAPORE":
//       return "SG";
//     case "AMSTERDAM":
//       return "AMS";
//        case 'OSLO': return 'OSL'

//     default:
//       break;
//   }
// };

const cohort2regionCollections = (collections: string[]) =>
  collections.map(collection => ({
    name: collection,
    groups: [
      {
        listenerField: "cohort",
        synonymField: "region",
        transformer: cohort2region,
      },
    ],
  }));

const config = [
  {
    name: "cohorts",
    groups: [
      {
        listenerField: "cohort",
        synonymField: "region",
        transformer: cohort2region,
      },
      {
        listenerField: "cohort",
        synonymField: "algoliaKey",
        transformer: cohort2algoliaKey,
      },
    ],
  },
  ...cohort2regionCollections([
    "hubResources",
    "profiles",
    "teams",
    "sprintSubmissions",
    "portfolio",
    "trackoutApplications",
    "portfolioEnquiries",
  ]),
];
export default config;
