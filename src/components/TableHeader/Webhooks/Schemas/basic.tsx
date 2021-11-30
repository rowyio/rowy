import { Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";

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
  "static url:string",
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

export const webhookBasic = {
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
    return (
      <Typography color="text.disabled">
        <WarningIcon aria-label="Warning" style={{ verticalAlign: "bottom" }} />
        &nbsp; Verification is not currently available for basic webhooks
      </Typography>
    );
  },
};

export default webhookBasic;
