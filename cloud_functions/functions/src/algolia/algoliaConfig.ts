import * as _ from "lodash";
const flattenSnapshot = (
  field: { docPath: string; snapshot: any },
  preservedKeys: string[]
) => {
  return {
    docPath: field.docPath,
    ...preservedKeys.reduce((acc: any, currentKey: string) => {
      const value = _.get(field.snapshot, currentKey);
      if (value) {
        return { ...acc, [currentKey]: value };
      } else return acc;
    }, {}),
  };
};
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
    name: "teams",
    fieldsToSync: [
      "cohort",
      "teamName",
      "trackOutDate",
      {
        fieldName: "teamMembers",
        transformer: (teamMembers: any[]) => {
          return teamMembers.map(member =>
            flattenSnapshot(member, [
              "cohort",
              "firstName",
              "lastName",
              "preferredName",
              "profilePhoto",
            ])
          );
        },
      },
      "focusArea",
      "isDissolved",
      "oneLineDescription",
    ],
  },
  {
    name: "cohorts",
    fieldsToSync: ["cohort", "location", "demoDay"],
  },
];
export default algoliaConfig;
