export default [
  {
    type: "slack",
    topic: "spark_slack",
    triggers: ["create"],
    requiredFields: [],
    shouldRun: ({}) => true,
    sparkBody: {
      emails: ({}) => [],
      channels: async ({}) => ["C01B88WBYNQ"],
      blocks: ({ row }) => [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `👋🏻Hi Team,\n A new portfolio company has been created on Fusion\nTeam ${row.teamName} from ${row.cohort} \n\n *Meet the founders:*`,
          },
        },
        { type: "divider" },
        ...row.teamMembers.map((teamMember) => {
          const {
            firstName,
            lastName,
            email,
            profilePhoto,
          } = teamMember.snapshot;
          return {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${firstName} ${lastName}*\n email: ${email}`,
            },
            accessory: {
              type: "image",
              image_url: profilePhoto[0].downloadURL,
              alt_text: `${firstName}'s profile photo`,
            },
          };
        }),
        { type: "divider" },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Please add and welcome them to ALumni Slack`,
          },
        },
      ],
    },
  },
];
export const collectionPath = "portfolio";
