export const extensionTypes = [
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
] as const;

export type ExtensionType = typeof extensionTypes[number];

export const extensionNames: Record<ExtensionType, string> = {
  task: "Task",
  docSync: "Doc Sync",
  historySnapshot: "History Snapshot",
  algoliaIndex: "Algolia Index",
  meiliIndex: "MeiliSearch Index",
  bigqueryIndex: "Big Query Index",
  slackMessage: "Slack Message",
  sendgridEmail: "SendGrid Email",
  apiCall: "API Call",
  twilioMessage: "Twilio Message",
};

export type ExtensionTrigger = "create" | "update" | "delete";

export interface IExtensionEditor {
  displayName: string;
  photoURL: string;
  lastUpdate: number;
}

export interface IExtension {
  // rowy meta fields
  name: string;
  active: boolean;
  lastEditor: IExtensionEditor;

  // build fields
  triggers: ExtensionTrigger[];
  type: ExtensionType;
  requiredFields: string[];
  extensionBody: string;
  conditions: string;

  trackedFields?: string[];
}

export const triggerTypes: ExtensionTrigger[] = ["create", "update", "delete"];

const extensionBodyTemplate = {
  task: `const extensionBody: TaskBody = async({row, db, change, ref}) => {
  // task extensions are very flexible you can do anything from updating other documents in your database, to making an api request to 3rd party service.
  
  // example:
  // we can post notification to different discord channels based on row data
  /*
  const topic = row.topic;
  const channel = await db.collection('discordChannels').doc(topic).get();
  const channelUrl = await channel.get("channelUrl");
  const content = "Hello discord channel";
    return fetch("https://discord.com/api/webhooks/"+channelUrl, {
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content
        })
      }).then(async resp => {
        const result = await resp.json()
        if (resp.ok) console.info(result)
        else console.error(result)
      })
  */
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
    custom_args:{
      docPath:ref.path, // optional, reference to be used for tracking email events
      // add any other custom args you want to pass to sendgrid events here
    },
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

export function emptyExtensionObject(
  type: ExtensionType,
  user: IExtensionEditor
): IExtension {
  return {
    name: `${type} extension`,
    active: false,
    triggers: [],
    type,
    extensionBody: extensionBodyTemplate[type] ?? extensionBodyTemplate["task"],
    requiredFields: [],
    trackedFields: [],
    conditions: `const condition: Condition = async({row, change}) => {
  // feel free to add your own code logic here
  return true;
}`,
    lastEditor: user,
  };
}
export function sparkToExtensionObjects(
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
  const sparkTypes = [...oldSparks.matchAll(/type:(.*),/g)].map((x) =>
    x[1].trim().replace(/'/g, "")
  );
  const triggers = [...oldSparks.matchAll(/triggers:(.*),/g)].map((x) =>
    parseString2Array(x[1])
  );
  const shouldRun = [...oldSparks.matchAll(/shouldRun:(.*),/g)].map((x) =>
    x[1].trim()
  );
  const requiredFields = [...oldSparks.matchAll(/requiredFields:(.*),/g)].map(
    (x) => parseString2Array(x[1])
  );
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
  const extensionObjects = sparks?.map((spark, index): IExtension => {
    return {
      // rowy meta fields
      name: `Migrated spark ${index}`,
      active: true,
      lastEditor: user,

      // ft build fields
      triggers: (spark.triggers ?? []) as ExtensionTrigger[],
      type: spark.type as ExtensionType,
      requiredFields: spark.requiredFields ?? [],
      extensionBody: spark.sparkBody,
      conditions: spark.shouldRun ?? "",
    };
  });
  return extensionObjects ?? [];
}
