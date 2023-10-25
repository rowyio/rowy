import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

export const webhook = {
  name: "Web Form",
  type: "webform",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const formParser: Parser = async({req, db, ref, logging}) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("formParser started")
  
  // Import NPM package needed, some packages may not work in Webhooks
  // const {default: lodash} = await import("lodash");
  
  // Optionally return an object to be added as a new row to the table
  // Example: add the webhook body as row
  const {body} = req;
  ${
    table.audit !== false
      ? `const ${
          table.auditFieldCreatedBy ?? "_createdBy"
        } = await rowy.metadata.serviceAccountUser()
  return {
    ...body,
    ${table.auditFieldCreatedBy ?? "_createdBy"}
  }`
      : `return body;`
  }
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const condition: Condition = async({ref, req, db, logging}) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("condition started")
  
  return true;
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  Auth: (webhookObject: IWebhook, setWebhookObject: (w: IWebhook) => void) => {
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
