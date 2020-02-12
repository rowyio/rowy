const algoliaConfig = [
  {
    name: "founders",
    fieldsToSync: [
      "firstName",
      "lastName",
      "founderType",
      "cohort",
      "employerLogos",
    ],
  },
  {
    name: "advisors",
    fieldsToSync: [
      "firstName",
      "lastName",
      "location",
      "title",
      "type",
      "bio",
      "linkedIn",
      "expertise",
      "profilePhoto",
      "bookingLink",
      "twitter",
      "antlerPoc",
    ],
  },
  {
    name: "portfolio",
    fieldsToSync: [
      "cohort",
      "location",
      "companyName",
      "oneLine",
      "logo",
      "website",
      "year",
      "crunchbase",
      "angelList",
      "sector",
    ],
  },
  {
    name: "cohorts",
    fieldsToSync: ["cohort", "location", "demoDay"],
  },
];
export default algoliaConfig;
