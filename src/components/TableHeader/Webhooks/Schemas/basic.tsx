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

export default {
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
};
