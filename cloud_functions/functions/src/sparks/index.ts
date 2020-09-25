const sampleConfig = [
  {
    type: "slack",
    triggers: ["create"],
    shouldSend: (row, db) => true,
    requiredFields: [],
    target: (row, db) => ({ emails: ["shams@antler.co"], channels: [] }),
    message: (row, db) => ({
      text: "I am a test ${user.firstName} message",
      attachments: [
        {
          text: "And here’s an attachment!",
        },
      ],
    }),
  },
  {
    type: "sendGrid",
    triggers: ["create"],
    requiredFields: [],
    shouldSend: (row, db) => true,
    to: (row, db) => "",
    cc: (row, db) => undefined,
    bcc: (row, db) => undefined,
    attachments: (row, db) => undefined,
    templateId: "d-",
    personalizations: ["firstName", { email: "user.email" }],
  },
  {
    type: "algolia",
    triggers: ["create", "update", "delete"],
    index: "users",
    requiredFields: ["email"],
    fieldsToSync: ["firstName", "lastName", "email", { email: "user.email" }],
  },
];
