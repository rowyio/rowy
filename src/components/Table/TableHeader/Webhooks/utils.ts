import { generateRandomId } from "@src/utils/fns";

export const webhookTypes = [
  "basic",
  "typeform",
  "sendgrid",
  "shopify",
  "twitter",
  "stripe",
] as const;

export type WebhookType = typeof webhookTypes[number];

export const webhookNames: Record<WebhookType, string> = {
  sendgrid: "Sendgrid",
  typeform: "Typeform",
  shopify: "Shopify",
  twitter: "Twitter",
  stripe: "Stripe",
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
}

const parserTemplates = {
  basic: `const basicParser: BasicParser = async({req, db,ref}) => {
    // request is the request object from the webhook
    // db is the database object
    // ref is the reference to collection of the table
    // the returned object will be added as a new row to the table
    // eg: adding the webhook body as row
    const {body} = req;
    return body;
}`,
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
    parser: parserTemplates[type] ?? parserTemplates["basic"],
    conditions: `const condition: Condition = async({ref,req,db}) => {
  // feel free to add your own code logic here
  return true;
}`,
    lastEditor: user,
  };
}
