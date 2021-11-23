import { Typography, Link } from "@mui/material";
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
  auth?: any;
}

export const webhookSchemas = {
  basic: {
    name: "Basic",
    parser: `const basicParser: BasicParser = async({req, db,ref}) => {
      // request is the request object from the webhook
      // db is the database object
      // ref is the reference to collection of the table
      // the returned object will be added as a new row to the table
      // eg: adding the webhook body as row
      const {body} = req;
      return body;
  }`,
    conditional: `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
    auth: (webhookObject, setWebhookObject) => {
      return <></>;
    },
  },
  typeform: {
    name: "Typeform",
    parser: `const typeformParser: TypeformParser = async({req, db,ref}) =>{
      // this reduces the form submission into a single object of key value pairs
      // eg: {name: "John", age: 20}
      // ⚠️ ensure that you have assigned ref values of the fields
      // set the ref value to field key you would like to sync to
      // docs: https://help.typeform.com/hc/en-us/articles/360050447552-Block-reference-format-restrictions
      const {submitted_at,hidden,answers} = req.body.form_response
      return ({
      _createdAt: submitted_at,
      ...hidden,
      ...answers.reduce((accRow, currAnswer) => {
        switch (currAnswer.type) {
          case "date":
            return {
              ...accRow,
              [currAnswer.field.ref]: new Date(currAnswer[currAnswer.type]),
            };
          case "choice":
            return {
              ...accRow,
              [currAnswer.field.ref]: currAnswer[currAnswer.type].label,
            };
          case "choices":
            return {
              ...accRow,
              [currAnswer.field.ref]: currAnswer[currAnswer.type].labels,
            };
          case "file_url":
          default:
            return {
              ...accRow,
              [currAnswer.field.ref]: currAnswer[currAnswer.type],
            };
        }
      }, {}),
    })};`,
    conditional: `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
    auth: (webhookObject, setWebhookObject) => {
      return (
        <Typography gutterBottom>
          To verify the webhook call is sent from typeform, you need to add
          secret on your webhook config on be follow the instructions{" "}
          <Link
            href={
              "https://developers.typeform.com/webhooks/secure-your-webhooks/"
            }
            rel="noopener noreferrer"
            variant="body2"
            underline="always"
          >
            here
          </Link>{" "}
          then add the secret below
        </Typography>
      );
    },
  },
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
    parser: webhookSchemas[type].parser ?? webhookSchemas["basic"].parser,
    conditions:
      webhookSchemas[type].conditional ?? webhookSchemas["basic"].conditional,
    lastEditor: user,
  };
}
