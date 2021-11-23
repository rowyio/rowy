import { Typography, Link, TextField } from "@mui/material";
import { generateRandomId } from "@src/utils/fns";

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
  sendgrid: "Sendgrid",
  typeform: "Typeform",
  // shopify: "Shopify",
  // twitter: "Twitter",
  //    stripe: "Stripe",
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
    parser: {
      additionalVariables,
      extraLibs: parserExtraLibs,
      template: `const basicParser: Parser = async({req, db,ref}) => {
      // request is the request object from the webhook
      // db is the database object
      // ref is the reference to collection of the table
      // the returned object will be added as a new row to the table
      // eg: adding the webhook body as row
      const {body} = req;
      return body;
  }`,
    },
    condition: {
      additionalVariables,
      extraLibs: conditionExtraLibs,
      template: `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
    },
    auth: (webhookObject, setWebhookObject) => {
      return <></>;
    },
  },
  typeform: {
    name: "Typeform",
    parser: {
      additionalVariables: null,
      extraLibs: null,

      template: `const typeformParser: Parser = async({req, db,ref}) =>{
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
    },
    condition: {
      additionalVariables: null,
      extraLibs: null,
      template: `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
    },
    auth: (webhookObject, setWebhookObject) => {
      return (
        <>
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
            to set the secret, then add it below
          </Typography>

          <TextField
            label={"Typeform Secret"}
            value={webhookObject.auth.secret}
            onChange={(e) => {
              setWebhookObject({
                ...webhookObject,
                auth: { ...webhookObject.auth, secret: e.target.value },
              });
            }}
          />
        </>
      );
    },
  },
  sendgrid: {
    name: "Sendgrid",
    parser: {
      additionalVariables: null,
      extraLibs: null,
      template: `const sendgridParser: Parser = async({req, db,ref}) =>{

        // {
        //   "email": "example@test.com",
        //   "timestamp": 1513299569,
        //   "smtp-id": "<14c5d75ce93.dfd.64b469@ismtpd-555>",
        //   "event": "processed",
        //   "category": "cat facts",
        //   "sg_event_id": "sg_event_id",
        //   "sg_message_id": "sg_message_id"
        // },


    };`,
    },
    condition: {
      additionalVariables: null,
      extraLibs: null,
      template: `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
    },
    auth: (webhookObject, setWebhookObject) => {
      return (
        <>
          <Typography gutterBottom>
            To verify the webhook call is sent from Sendgrid, You can enable
            signed event webhooks
            <Link
              href={
                "https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features#enable-the-signed-event-webhook"
              }
              rel="noopener noreferrer"
              variant="body2"
              underline="always"
            >
              here
            </Link>{" "}
            to set the secret, then add it below
          </Typography>

          <TextField
            label={"Verification Key"}
            value={webhookObject.auth.secret}
            onChange={(e) => {
              setWebhookObject({
                ...webhookObject,
                auth: { ...webhookObject.auth, secret: e.target.value },
              });
            }}
          />
        </>
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
    parser:
      webhookSchemas[type].parser?.template ??
      webhookSchemas["basic"].parser.template,
    conditions:
      webhookSchemas[type].condition?.template ??
      webhookSchemas["basic"].condition.template,
    lastEditor: user,
  };
}
