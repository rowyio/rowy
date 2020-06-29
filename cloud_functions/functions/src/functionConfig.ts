export const config = {
  indices: [
    {
      fieldsToSync: [
        "cohort",

        "teamName",
        {
          fieldName: "teamMembers",
          snapshotFields: [
            "cohort",
            "firstName",
            "lastName",
            "twitter",
            "linkedin",
          ],
        },
        "elevatorPitch",
      ],
      name: "portfolio",
    },
    {
      fieldsToSync: ["status", "cohort", "region", "website", "crunchbase"],
      name: "portfolio-fusion",
    },
  ],
  name: "portfolio",
};
