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
  shouldRun: string;
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
    // task sparks are very flexible you can do anything from updating other documents in your database, to making an api request to 3rd party service.

    // eg:
    // const got = require('got');
    // const {body} = await got.post('https://httpbin.org/anything', {
		// json: {
		//	  hello: 'world'
		// },
		// responseType: 'json'
	  // });

	  // console.log(body.data);
	  // => {hello: 'world'}
    
    console.log("Task Spark completed.")
}`,
  docSync: `const sparkBody: DocSyncBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here

    return ({
      fieldsToSync: [],    // a list of string of column names
      row: row,    // object of data to sync, usually the row itself
      targetPath: "",  // fill in the path here
  })
}`,
  historySnapshot: `const sparkBody: HistorySnapshotBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    
    return ({
      trackedFields: [],    // a list of string of column names
    })
}`,
  algoliaIndex: `const sparkBody: AlgoliaIndexBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    
    return ({
      fieldsToSync: [],    // a list of string of column names
      row: row,    // object of data to sync, usually the row itself
      index: "",    // algolia index to sync to
      objectID: ref.id,    // algolia object ID, ref.id is one possible choice
    })
}`,
  meiliIndex: `const sparkBody: MeiliIndexBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here

    return({
      fieldsToSync: [],    // a list of string of column names
      row: row,    // object of data to sync, usually the row itself
      index: "",    // algolia index to sync to
      objectID: ref.id,    // algolia object ID, ref.id is one possible choice
    })
}`,
  bigqueryIndex: `const sparkBody: BigqueryIndexBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here

    return ({
      fieldsToSync: [],    // a list of string of column names
      row: row,    // object of data to sync, usually the row itself
      index: "",    // algolia index to sync to
      objectID: ref.id,    // algolia object ID, ref.id is one possible choice
    })
}`,
  slackMessage: `const sparkBody: SlackMessageBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    
    return ({
      channels: [],    // a list of slack channel IDs in string
      blocks: [],    // the blocks parameter to pass in to slack api
      text: "",    // the text parameter to pass in to slack api
      attachments: [],    // the attachments parameter to pass in to slack api
    })
}`,
  sendgridEmail: `const sparkBody: SendgridEmailBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    
    return ({
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
    })
}`,
  apiCall: `const sparkBody: ApiCallBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
   
    return ({
      body: "",
      url: "",
      method: "",
      callback: ()=>{},
    })
}`,
  twilioMessage: `const sparkBody: TwilioMessageBody = async({row, db, change, ref}) => {
    // feel free to add your own code logic here
    
    return ({
      from:"",
      to:"",
      body:"Hi there!"
    })
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
  const serialisedSpark =
    "[" +
    sparks
      .filter((spark) => spark.active)
      .map(
        (spark) => `{
          name: "${spark.name}",
          type: "${spark.type}",
          triggers: [${spark.triggers
            .map((trigger) => `"${trigger}"`)
            .join(", ")}],
          shouldRun: ${spark.shouldRun
            .replace(/^.*:\s*Condition\s*=/, "")
            .replace(/\s*;\s*$/, "")},
          requiredFields: [${spark.requiredFields
            .map((field) => `"${field}"`)
            .join(", ")}],
          sparkBody: ${spark.sparkBody
            .replace(/^.*:\s*\w*Body\s*=/, "")
            .replace(/\s*;\s*$/, "")}
        }`
      )
      .join(",") +
    "]";
  console.log("serialisedSpark", serialisedSpark);
  return serialisedSpark;
}

export { serialiseSpark, sparkTypes, triggerTypes, emptySparkObject };
export type { ISpark, ISparkType, ISparkEditor };
