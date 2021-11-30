import { generateRandomId } from "@src/utils/fns";
import { typeform, basic, sendgrid } from "./Schemas";
export const webhookTypes = [
  "basic",
  "typeform",
  "sendgrid",
  //"shopify",
  //"twitter",
  //"stripe",
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
  `type Parser = (args:{req:WebHookRequest,db: FirebaseFirestore.Firestore,ref: FirebaseFirestore.CollectionReference}) => Promise<any>;`,
];
export const conditionExtraLibs = [
  requestType,
  `type Condition = (args:{req:WebHookRequest,db: FirebaseFirestore.Firestore,ref: FirebaseFirestore.CollectionReference}) => Promise<any>;`,
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
  // stripe: "Stripe",
  basic: "Basic",
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

export const webhookSchemas = {
  basic,
  typeform,
  sendgrid,
};

export function emptyWebhookObject(
  type: WebhookType,
  user: IWebhookEditor
): IWebhook {
  return {
    name: "Untitled webhook",
    active: false,
    endpoint: generateRandomId(),
    type,
    parser:
      webhookSchemas[type].parser?.template ??
      webhookSchemas["basic"].parser.template,
    conditions:
      webhookSchemas[type].condition?.template ??
      webhookSchemas["basic"].condition.template,
    lastEditor: user,
  };
}
