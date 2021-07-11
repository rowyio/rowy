type IExtensionType =
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

type IExtensionTrigger = "create" | "update" | "delete";

interface IExtensionEditor {
  displayName: string;
  photoURL: string;
  lastUpdate: number;
}

interface IExtension {
  // firetable meta fields
  name: string;
  active: boolean;
  lastEditor: IExtensionEditor;

  // ft build fields
  triggers: IExtensionTrigger[];
  type: IExtensionType;
  requiredFields: string[];
  extensionBody: string;
  conditions: string;
}

const triggerTypes: IExtensionTrigger[] = ["create", "update", "delete"];

const extensionTypes: IExtensionType[] = [
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

const extensionBodyTemplate = {
  task: `const extensionBody: TaskBody = async({row, db, change, ref}) => {
  // task extensions are very flexible you can do anything from updating other documents in your database, to making an api request to 3rd party service.

  // eg:
  // const got = require('got');
  // const {body} = await got.post('https://httpbin.org/anything', {
  // json: {
  //    hello: 'world'
  // },
  // responseType: 'json'
  // });

  // console.log(body.data);
  // => {hello: 'world'}
    
  console.log("Task Extension completed.")
}`,
  docSync: `const extensionBody: DocSyncBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here

  return ({
    fieldsToSync: [],    // a list of string of column names
    row: row,    // object of data to sync, usually the row itself
    targetPath: "",  // fill in the path here
  })
}`,
  historySnapshot: `const extensionBody: HistorySnapshotBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here
  
  return ({
    trackedFields: [],    // a list of string of column names
  })
}`,
  algoliaIndex: `const extensionBody: AlgoliaIndexBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here
  
  return ({
    fieldsToSync: [],    // a list of string of column names
    row: row,    // object of data to sync, usually the row itself
    index: "",    // algolia index to sync to
    objectID: ref.id,    // algolia object ID, ref.id is one possible choice
  })
}`,
  meiliIndex: `const extensionBody: MeiliIndexBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here

  return({
    fieldsToSync: [],    // a list of string of column names
    row: row,    // object of data to sync, usually the row itself
    index: "",    // algolia index to sync to
    objectID: ref.id,    // algolia object ID, ref.id is one possible choice
  })
}`,
  bigqueryIndex: `const extensionBody: BigqueryIndexBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here

  return ({
    fieldsToSync: [],    // a list of string of column names
    row: row,    // object of data to sync, usually the row itself
    index: "",    // algolia index to sync to
    objectID: ref.id,    // algolia object ID, ref.id is one possible choice
  })
}`,
  slackMessage: `const extensionBody: SlackMessageBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here
  
  return ({
    channels: [],    // a list of slack channel IDs in string
    blocks: [],    // the blocks parameter to pass in to slack api
    text: "",    // the text parameter to pass in to slack api
    attachments: [],    // the attachments parameter to pass in to slack api
  })
}`,
  sendgridEmail: `const extensionBody: SendgridEmailBody = async({row, db, change, ref}) => {
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
  apiCall: `const extensionBody: ApiCallBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here
  
  return ({
    body: "",
    url: "",
    method: "",
    callback: ()=>{},
  })
}`,
  twilioMessage: `const extensionBody: TwilioMessageBody = async({row, db, change, ref}) => {
  // feel free to add your own code logic here
  
  return ({
    from:"",
    to:"",
    body:"Hi there!"
  })
}`,
};

function emptyExtensionObject(
  type: IExtensionType,
  user: IExtensionEditor
): IExtension {
  return {
    name: "Untitled extension",
    active: false,
    triggers: [],
    type,
    extensionBody: extensionBodyTemplate[type] ?? extensionBodyTemplate["task"],
    requiredFields: [],
    conditions: `const condition: Condition = async({row, change}) => {
  // feel free to add your own code logic here
  return true;
}`,
    lastEditor: user,
  };
}

/* Convert extension objects into a single ft-build readable string */
function serialiseExtension(extensions: IExtension[]): string {
  const serialisedExtension =
    "[" +
    extensions
      .filter((extension) => extension.active)
      .map(
        (extension) => `{
          name: "${extension.name}",
          type: "${extension.type}",
          triggers: [${extension.triggers
            .map((trigger) => `"${trigger}"`)
            .join(", ")}],
          conditions: ${extension.conditions
            .replace(/^.*:\s*Condition\s*=/, "")
            .replace(/\s*;\s*$/, "")},
          requiredFields: [${extension.requiredFields
            .map((field) => `"${field}"`)
            .join(", ")}],
          extensionBody: ${extension.extensionBody
            .replace(/^.*:\s*\w*Body\s*=/, "")
            .replace(/\s*;\s*$/, "")}
        }`
      )
      .join(",") +
    "]";
  console.log("serialisedExtension", serialisedExtension);
  return serialisedExtension;
}

function sparkToExtensionObjects(
  sparkConfig: string,
  user: IExtensionEditor
): IExtension[] {
  const parseString2Array = (str: string): string[] => {
    return str
      .trim()
      .replace(/\[|\]/g, "")
      .split(",")
      .map((x) => x.trim().replace(/'/g, ""));
  };
  const oldSparks = sparkConfig.replace(/"/g, "'");
  const sparkTypes = oldSparks
    .match(/(?<=type:).*(?=,)/g)
    ?.map((x) => x.trim().replace(/'/g, ""));
  const triggers = oldSparks
    .match(/(?<=triggers:).*(?=,)/g)
    ?.map((x) => parseString2Array(x));
  const shouldRun = oldSparks
    .match(/(?<=shouldRun:).*(?=,)/g)
    ?.map((x) => x.trim());
  const requiredFields = oldSparks
    .match(/(?<=requiredFields:).*(?=,)/g)
    ?.map((x) => parseString2Array(x));
  const splitSparks = oldSparks.split(`type:`);
  const sparks = sparkTypes?.map((x, index) => {
    const sparkBody = splitSparks[index + 1]
      ?.split("sparkBody:")[1]
      ?.trim()
      .slice(0, -1);
    const _triggers = triggers?.[index];
    const _shouldRun = shouldRun?.[index];
    const _requiredFields = requiredFields?.[index];
    return {
      type: x,
      triggers: _triggers,
      shouldRun: _shouldRun,
      requiredFields: _requiredFields,
      sparkBody,
    };
  });
  const extensionObjects = sparks?.map(
    (spark, index): IExtension => {
      return {
        // firetable meta fields
        name: `Migrated spark ${index}`,
        active: true,
        lastEditor: user,

        // ft build fields
        triggers: (spark.triggers ?? []) as IExtensionTrigger[],
        type: spark.type as IExtensionType,
        requiredFields: spark.requiredFields ?? [],
        extensionBody: spark.sparkBody,
        conditions: spark.shouldRun ?? "",
      };
    }
  );
  return extensionObjects ?? [];
}

export {
  serialiseExtension,
  extensionTypes,
  triggerTypes,
  emptyExtensionObject,
  sparkToExtensionObjects,
};
export type { IExtension, IExtensionType, IExtensionEditor };
