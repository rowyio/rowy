/* eslint-disable tsdoc/syntax */
type Trigger = "create" | "update" | "delete";
type Triggers = Trigger[];

// function types that defines extension body and should run
type Condition =
  | boolean
  | ((data: ExtensionContext) => boolean | Promise<boolean>);

// the argument that the extension body takes in
type ExtensionContext = {
  row: Row;
  ref: FirebaseFirestore.DocumentReference;
  storage: firebasestorage.Storage;
  db: FirebaseFirestore.Firestore;
  auth: firebaseauth.BaseAuth;
  change: any;
  triggerType: Triggers;
  fieldTypes: any;
  extensionConfig: {
    label: string;
    type: string;
    triggers: Trigger[];
    conditions: Condition;
    requiredFields: string[];
    extensionBody: any;
  };
  RULES_UTILS: any;
  logging: RowyLogging;
};

// extension body definition
type slackEmailBody = {
  channels?: string[];
  text?: string;
  emails: string[];
  blocks?: object[];
  attachments?: any;
};

type slackChannelBody = {
  channels: string[];
  text?: string;
  emails?: string[];
  blocks?: object[];
  attachments?: any;
};

type DocSyncBody = (context: ExtensionContext) => Promise<{
  fieldsToSync: Fields;
  row: Row;
  targetPath: string;
}>;

type HistorySnapshotBody = (context: ExtensionContext) => Promise<{
  trackedFields: Fields;
}>;

type AlgoliaIndexBody = (context: ExtensionContext) => Promise<{
  fieldsToSync: Fields;
  index: string;
  row: Row;
  objectID: string;
}>;

type MeiliIndexBody = (context: ExtensionContext) => Promise<{
  fieldsToSync: Fields;
  index: string;
  row: Row;
  objectID: string;
}>;

type BigqueryIndexBody = (context: ExtensionContext) => Promise<{
  fieldsToSync: Fields;
  index: string;
  row: Row;
  objectID: string;
}>;

type SlackMessageBody = (
  context: ExtensionContext
) => Promise<slackEmailBody | slackChannelBody>;

type SendgridEmailBody = (context: ExtensionContext) => Promise<any>;

type ApiCallBody = (context: ExtensionContext) => Promise<{
  body: string;
  url: string;
  method: string;
  callback: any;
}>;

type TwilioMessageBody = (context: ExtensionContext) => Promise<{
  body: string;
  from: string;
  to: string;
}>;

type PushNotificationRequest = {
  notification: {
    title?: string;
    body?: string;
    imageUrl?: string;
  };
  android?: {
    notification: {
      imageUrl?: string;
    };
  };
  apns?: {
    payload: {
      aps: {
        "mutable-content"?: number;
      };
    };
    fcm_options: {
      image?: string;
    };
  };
  webpush?: {
    headers?: {
      image?: string;
    };
  };
  topic?: string;
  token?: string;
};
type PushNotificationBody = (
  context: ExtensionContext
) => Message | Message[] | Promise<Message | Message[]>;

type TaskBody = (context: ExtensionContext) => Promise<any>;

type BuildshipTriggerBody = (context: ExtensionContext) => Promise<{
  buildshipConfig: {
    projectId: string;
    workflowId: string;
  };
  body: string;
}>;
