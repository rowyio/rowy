export const triggerPath = "portfolio/{docId}";
export const functionName = "portfolio";
export const derivativesConfig = [
  {
    fieldName: "femaleFoundersCount",
    evaluate: async ({ row, ref, db, auth }) => {
      const { teamMembers } = row;
      const foundersPromises = await teamMembers.map(async (member) => {
        const founderDoc = await db.doc(member.docPath).get();
        return founderDoc.data();
      });
      const founders = await Promise.all(foundersPromises);
      return founders.reduce((acc: number, curr: any) => {
        if (curr.gender === "female") return acc + 1;
        else return acc;
      }, 0);
    },
    listenerFields: ["teamMembers"],
  },
  {
    fieldName: "startupEmail",
    evaluate: async ({ row, ref, db, auth }) => {
      const { teamMembers, startupEmail } = row;
      if (startupEmail) {
        return startupEmail;
      }
      if (teamMembers && teamMembers.length !== 0) {
        const founderDoc = await db.doc(teamMembers[0].docPath).get();
        const data = founderDoc.data();
        return data ? data.email : null;
      } else return null;
    },
    listenerFields: ["startupEmail", "teamMembers"],
  },
  {
    fieldName: "randomId",
    evaluate: async ({ row, ref, db, auth }) => {
      const { v4: uuidv4 } = require("uuid");
      return uuidv4();
    },
    listenerFields: ["teamName"],
  },
  {
    fieldName: "hasFemaleCEO",
    evaluate: async ({ row, ref, db, auth }) => {
      const { teamMembers } = row;
      const foundersPromises = await teamMembers.map(async (member) => {
        const founderDoc = await db.doc(member.docPath).get();
        return founderDoc.data();
      });
      const founders = await Promise.all(foundersPromises);
      return founders.reduce((acc: number, curr: any) => {
        if (curr.gender === "female") return acc + 1;
        else return acc;
      }, 0);
    },
    listenerFields: ["teamMembers"],
  },
];
export const sparksConfig = [
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
        {
          type: "divider",
        },
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
        {
          type: "divider",
        },
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
