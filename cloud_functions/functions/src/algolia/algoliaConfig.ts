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
      "companyName",
      "oneLine",
      "logo",
      "website",
      "crunchbase",
      "angelList",
      "sector",
    ],
  },
];

export default algoliaConfig;
