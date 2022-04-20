import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

export const webhook = {
  name: "Web Form",
  type: "webform",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (table) => `const formParser: Parser = async({req, db,ref}) => {
      // request is the request object from the webhook
      // db is the database object
      // ref is the reference to collection of the table
      // the returned object will be added as a new row to the table
      // eg: adding the webhook body as row
      const {body} = req;
      ${
        table.audit !== false
          ? `
      // auditField
      const ${
        table.auditFieldCreatedBy ?? "_createdBy"
      } = await rowy.metadata.serviceAccountUser()
      return {
        ...body,
        ${table.auditFieldCreatedBy ?? "_createdBy"}
      }
      `
          : `
      return body;
      `
      }
      
  }`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: (table) => `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
  },
  auth: (webhookObject, setWebhookObject) => {
    return (
      <>
        <Typography gutterBottom>
          Add your capture key
          <Link
            href=""
            target="_blank"
            rel="noopener noreferrer"
            variant="inherit"
          >
            these instructions
            <InlineOpenInNewIcon />
          </Link>
          <br />
          Then add the secret below.
        </Typography>

        <TextField
          id="api-key"
          label="API Key"
          fullWidth
          value={webhookObject.auth.secret}
          onChange={(e) => {
            setWebhookObject({
              ...webhookObject,
              auth: { ...webhookObject.auth, secret: e.target.value },
            });
          }}
        />

        <TextField
          id="minimum-score"
          label="Minimum score"
          fullWidth
          type="number"
          value={webhookObject.auth.minimumScore}
          onChange={(e) => {
            setWebhookObject({
              ...webhookObject,
              auth: { ...webhookObject.auth, minimumScore: e.target.value },
            });
          }}
        />
      </>
    );
  },
};

export default webhook;
