const algoliaConfig = [
  { name: "founders" },
  {
    name: "portfolio",
    fieldsToSync: [
      "cohort",
      "company",
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
