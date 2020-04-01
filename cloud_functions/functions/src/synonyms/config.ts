import * as algoliasearch from "algoliasearch";

import { env } from "../config";
import * as _ from "lodash";
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

const tableConnect2ids = records => records.map(r => r.snapshot.objectID);
const cohort2region = (cohort: string) =>
  cohort.toUpperCase().replace(/\d+.*$/, "");

const locations = [
  { location: "Sydney", region: "SYD" },
  { location: "Singapore", region: "SG" },
  { location: "Amsterdam", region: "AMS" },
  { location: "Oslo", region: "OSL" },
  { location: "New York", region: "NYC" },
  { location: "London", region: "LON" },
  { location: "Nairobi", region: "NAI" },
  { location: "Stockholm", region: "STO" },
];

const location2region = (location: string) => {
  const _location = _.find(locations, { location });

  return _location ? _location.region : "GLOBAL";
};
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
    name: "advisors",
    groups: [
      {
        listenerField: "location",
        synonymField: "region",
        transformer: location2region,
      },
    ],
  },
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
        transformer: (cohort: string) =>
          client.generateSecuredApiKey(
            env.algolia.search, // Make sure to use a search key
            {
              filters: `cohort:${cohort} OR cohort:Global`,
              restrictIndices: [
                "teams",
                "founders",
                "hubResources",
                "advisors",
                "partnerships",
              ],
            }
          ),
      },
      {
        listenerField: "cohort",
        synonymField: "demoDayAlgoliaKey",
        transformer: (cohort: string) =>
          client.generateSecuredApiKey(
            env.algolia.search, // Make sure to use a search key
            {
              filters: `cohort:${cohort} AND showOnDemoDayWebsite:true`,
              restrictIndices: ["portfolio"],
            }
          ),
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
        synonymField: "icPage",
        transformer: (cohort, doc) => {
          if (doc.icType === "IC") {
            return `https://firepage.antler.co/IC/${cohort}`;
          } else return "";
        },
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
        listenerField: "coach",
        synonymField: "coachID",
        transformer: tableConnect2ids,
      },
      {
        listenerField: "cohort",
        synonymField: "region",
        transformer: cohort2region,
      },
      {
        listenerField: "id",
        synonymField: "ddPage",
        transformer: id => `https://firepage.antler.co/DD/${id}`,
      },
    ],
  },
  ...cohort2regionCollections([
    "hubResources",
    "profiles",
    "sprintSubmissions",
    "trackoutApplications",
    "portfolioEnquiries",
  ]),
];
export default config;
