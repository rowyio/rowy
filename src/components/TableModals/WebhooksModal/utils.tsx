import { TableSettings } from "@src/types/table";
import { generateId } from "@src/utils/table";
import { typeform, basic, sendgrid, webform, stripe } from "./Schemas";

export const webhookTypes = [
  "basic",
  "typeform",
  "sendgrid",
  "webform",
  //"shopify",
  //"twitter",
  "stripe",
] as const;

const requestType = [
  "declare type WebHookRequest {",
  "    /**",
  "     * Webhook Request object",
  "     */",
  "static params:string[]",
  "static query:string",
  "static body:any",
  "static headers:any",
  "}",
].join("\n");

export const parserExtraLibs = [
  requestType,
  `type Parser = (
    args: {
      req: WebHookRequest;
      db: FirebaseFirestore.Firestore;
      ref: FirebaseFirestore.CollectionReference;
      res: {
        send: (v:any)=>void;
        sendStatus: (status:number)=>void
      };
      logging: RowyLogging;
      auth:firebaseauth.BaseAuth;
      storage:firebasestorage.Storage;
    }
  ) => Promise<any>;`,
];
export const conditionExtraLibs = [
  requestType,
  `type Condition = (
     args: {
      req:WebHookRequest,
      db: FirebaseFirestore.Firestore,
      ref: FirebaseFirestore.CollectionReference,
      res: {
        send: (v:any)=>void
        sendStatus: (status:number)=>void
      };
      logging: RowyLogging;
      auth:firebaseauth.BaseAuth;
      storage:firebasestorage.Storage;
    }
  ) => Promise<any>;`,
];

const additionalVariables = [
  {
    key: "req",
    description: "webhook request",
  },
];

export type WebhookType = typeof webhookTypes[number];

export const webhookNames: Record<WebhookType, string> = {
  sendgrid: "SendGrid",
  typeform: "Typeform",
  //github:"GitHub",
  // shopify: "Shopify",
  // twitter: "Twitter",
  stripe: "Stripe",
  basic: "Basic",
  webform: "Web Form",
};

export interface IWebhookEditor {
  displayName: string;
  photoURL: string;
  lastUpdate: number;
}

export interface IWebhook {
  // rowy meta fields
  name: string;
  active: boolean;
  lastEditor: IWebhookEditor;
  // webhook specific fields
  endpoint: string;
  type: WebhookType;
  parser: string;
  conditions: string;
  auth?: any;
}

export interface ISecret {
  loading: boolean;
  keys: string[];
  projectId: string;
}

export const webhookSchemas = {
  basic,
  typeform,
  sendgrid,
  webform,
  stripe,
};

export function emptyWebhookObject(
  type: WebhookType,
  user: IWebhookEditor,
  table: TableSettings
): IWebhook {
  return {
    name: `${type} webhook`,
    active: true,
    endpoint: generateId(),
    type,
    parser: webhookSchemas[type].parser?.template(table),
    conditions: webhookSchemas[type].condition?.template(table),
    lastEditor: user,
  };
}
