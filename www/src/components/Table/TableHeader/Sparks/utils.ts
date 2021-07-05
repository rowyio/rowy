type ISparkType =
  | "task"
  | "docSync"
  | "historySnapshot"
  | "algoliaIndex"
  | "meiliIndex"
  | "bigqueryIndex"
  | "slackMessage"
  | "sendgridEmail"
  | "apiCall"
  | "twilioMessage";

type ISparkTrigger = "create" | "update" | "delete";

interface ISparkEditor {
  displayName: string;
  photoURL: string;
  lastUpdate: number;
}

interface ISpark {
  // firetable meta fields
  name: string;
  active: boolean;
  lastEditor: ISparkEditor;

  // ft build fields
  triggers: ISparkTrigger[];
  type: ISparkType;
  requiredFields: string[];
  sparkBody: string;
  shouldRun: boolean | string;
}

const triggerTypes: ISparkTrigger[] = ["create", "update", "delete"];

const sparkTypes: ISparkType[] = [
  "task",
  "docSync",
  "historySnapshot",
  "algoliaIndex",
  "meiliIndex",
  "bigqueryIndex",
  "slackMessage",
  "sendgridEmail",
  "apiCall",
  "twilioMessage",
];

const sparkBodyTemplate = {
  task: `const sparkBody: TaskBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    console.log("Spark is invoked.")
}`,
  docSync: `const sparkBody: DocSyncBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        fieldsToSync: [],    // a list of string of column names
        row: row,    // object of data to sync, usually the row itself
        targetPath: "",  // fill in the path here
    }
    return body
}`,
  historySnapshot: `const sparkBody: HistorySnapshotBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        trackedFields: [],    // a list of string of column names
    }
    return body
}`,
  algoliaIndex: `const sparkBody: AlgoliaIndexBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        fieldsToSync: [],    // a list of string of column names
        row: row,    // object of data to sync, usually the row itself
        index: "",    // algolia index to sync to
        objectID: ref.id,    // algolia object ID, ref.id is one possible choice
    }
    return body
}`,
  meiliIndex: `const sparkBody: MeiliIndexBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        fieldsToSync: [],    // a list of string of column names
        row: row,    // object of data to sync, usually the row itself
        index: "",    // algolia index to sync to
        objectID: ref.id,    // algolia object ID, ref.id is one possible choice
    }
    return body
}`,
  bigqueryIndex: `const sparkBody: BigqueryIndexBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        fieldsToSync: [],    // a list of string of column names
        row: row,    // object of data to sync, usually the row itself
        index: "",    // algolia index to sync to
        objectID: ref.id,    // algolia object ID, ref.id is one possible choice
    }
    return body
}`,
  slackMessage: `const sparkBody: SlackMessageBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        channels: [],    // a list of slack channel IDs in string
        blocks: [],    // the blocks parameter to pass in to slack api
        text: "",    // the text parameter to pass in to slack api
        attachments: [],    // the attachments parameter to pass in to slack api
    }
    return body
}`,
  sendgridEmail: `const sparkBody: SendgridEmailBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
        from: "Name<example@domain.com>",   // send from field
        personalizations: [
            {
                to: [{ name: "", email: "" }],  // recipient
                dynamic_template_data: {
                },  // template parameters
            },
        ],
        template_id: "",    // sendgrid template ID
        categories: [], // helper info to categorise sendgrid emails
    }
    return body
}`,
  apiCall: `const sparkBody: ApiCallBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
      body: "",
      url: "",
      method: "",
      callback: ()=>{},
    }
    return body
}`,
  twilioMessage: `const sparkBody: TwilioMessageBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    const body = {
    }
    return body
}`,
};

function emptySparkObject(type: ISparkType, user: ISparkEditor): ISpark {
  return {
    name: "Untitled spark",
    active: false,
    triggers: [],
    type,
    sparkBody: sparkBodyTemplate[type] ?? sparkBodyTemplate["task"],
    requiredFields: [],
    shouldRun: `const condition: Condition = async({row, change}) => {
    // feel free to add your own code logic here
    return true;
}`,
    lastEditor: user,
  };
}

/* Convert spark objects into a single ft-build readable string */
function serialiseSpark(sparks: ISpark[]): string {
  return "[]";
}

export { serialiseSpark, sparkTypes, triggerTypes, emptySparkObject };
export type { ISpark, ISparkType, ISparkEditor };
