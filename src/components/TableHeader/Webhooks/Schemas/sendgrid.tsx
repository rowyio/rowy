import { Typography, Link, TextField } from "@mui/material";

export default {
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
              "https://docs.sendgrid.com/for-developers/tracking-events/getting-started-event-webhook-security-features#the-signed-event-webhook"
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
