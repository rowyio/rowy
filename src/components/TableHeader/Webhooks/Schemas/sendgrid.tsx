import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

export const webhookSendgrid = {
  name: "SendGrid",
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
