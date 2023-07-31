import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

export const webhookSendgrid = {
  name: "SendGrid",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const sendgridParser: Parser = async ({ req, db, ref, logging }) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("sendgridParser started")
  
  // Import NPM package needed, some packages may not work in Webhooks
  // const {default: lodash} = await import("lodash");
  
  const { body } = req 
  const eventHandler = async (sgEvent) => {
    // Event handlers can be modiefed to preform different actions based on the sendgrid event
    // List of events & docs : https://docs.sendgrid.com/for-developers/tracking-events/event#events
    const { event, docPath } = sgEvent
    // Event param is provided by default
    // However docPath or other custom parameter needs be passed in the custom_args variable in Sengrid Extension 
    return db.doc(docPath).update({ sgStatus: event })
  }
  if (Array.isArray(body)) {
    // Multiple events are passed in one call
    await Promise.allSettled(body.map(eventHandler))
  } else {
    eventHandler(body)
  }
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
};`,
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
          Enable Signed Event Webhooks on SendGrid by following{" "}
          <Link
            href="https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features#the-signed-event-webhook"
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
          id="sendgrid-verification-key"
          label="Verification key"
          value={webhookObject.auth.secret}
          fullWidth
          multiline
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
};

export default webhookSendgrid;
