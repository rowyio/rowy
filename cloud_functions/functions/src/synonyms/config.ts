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
  cohort.toUpperCase().replace(/\d+.*$/, "");

const cohort2location = (cohort: string) => {
  const _region = cohort2region(cohort);
  switch (_region) {
    case "SYD":
      return "Sydney";
    case "SG":
      return "Singapore";
    case "AMS":
      return "Amsterdam";
    case "OSL":
      return "Oslo";
    case "LON":
      return "London";
    case "STO":
      return "Stockholm";
    case "NYC":
      return "New York";
    case "NAI":
      return "Nairobi";
    default:
      return "";
  }
};

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
    name: "icManagement/{icId}/icMembers/{memberId}/votes",
    groups: [
      {
        listenerField: "team",
        synonymField: "teamName",
        transformer: team => (team[0] ? team[0].teamName : ""),
      },
    ],
  },
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
  {
    name: "icManagement",
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
  {
    name: "portfolio",
    groups: [
      {
        listenerField: "cohort",
        synonymField: "region",
        transformer: cohort2region,
      },
      {
        listenerField: "cohort",
        synonymField: "location",
        transformer: cohort2location,
      },
    ],
  },
  {
    name: "teams",
    groups: [
      {
        listenerField: "cohort",
        synonymField: "region",
        transformer: cohort2region,
      },
      {
        listenerField: "id",
        synonymField: "ddPage",
        transformer: id => `https://firepage.antler.co/DD?id=${id}`,
      },
    ],
  },
  ...cohort2regionCollections([
    "hubResources",
    "profiles",
    "sprintSubmissions",
    "trackoutApplications",
    "portfolioEnquiries",
    "icManagement",
  ]),
];
export default config;
