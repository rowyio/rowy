import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

export const webhookSendgrid = {
  name: "SendGrid",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table
    ) => `const sendgridParser: Parser = async ({ req, db, ref }) => {
      const { body } = req 
      const eventHandler = async (sgEvent) => {
          // Event handlers can be modiefed to preform different actions based on the sendgrid event
          // List of events & docs : https://docs.sendgrid.com/for-developers/tracking-events/event#events
          const { event, docPath } = sgEvent
          // event param is provided by default
          // however docPath or other custom parameter needs be passed in the custom_args variable in Sengrid Extension 
          return db.doc(docPath).update({ sgStatus: event })
      }
      // 
      if (Array.isArray(body)) {
          // when multiple events are passed in one call
          await Promise.allSettled(body.map(eventHandler))
      } else eventHandler(body)
  };`,
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
