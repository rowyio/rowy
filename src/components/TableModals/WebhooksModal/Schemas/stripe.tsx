import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

export const webhookStripe = {
  name: "Stripe",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const sendgridParser: Parser = async ({ req, db, ref }) => {
    const event = req.body
    switch (event.type) {
        case "payment_intent.succeeded":
            break;
        case "payment_intent.payment_failed":
            break;
    default:
      // all other types
  }
};`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const condition: Condition = async({ref,req,db}) => {
  // feel free to add your own code logic here
  return true;
}`,
  },
  auth: (webhookObject: IWebhook, setWebhookObject: (w: IWebhook) => void) => {
    return (
      <>
        <Typography gutterBottom>
          Get your{" "}
          <Link
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noopener noreferrer"
            variant="inherit"
          >
            secret key
            <InlineOpenInNewIcon />
          </Link>{" "}
          and{" "}
          <Link
            href="https://dashboard.stripe.com/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            variant="inherit"
          >
            signing key
            <InlineOpenInNewIcon />
          </Link>{" "}
          from Stripe dashboard.
          <br />
          Then add the secret below.
        </Typography>

        <TextField
          id="stripe-secret-key"
          label="Secret key"
          value={webhookObject.auth.secretKey}
          fullWidth
          multiline
          onChange={(e) => {
            setWebhookObject({
              ...webhookObject,
              auth: { ...webhookObject.auth, secretKey: e.target.value },
            });
          }}
        />
        <TextField
          id="stripe-signing-secret"
          label="Signing key"
          value={webhookObject.auth.signingSecret}
          fullWidth
          multiline
          onChange={(e) => {
            setWebhookObject({
              ...webhookObject,
              auth: { ...webhookObject.auth, signingSecret: e.target.value },
            });
          }}
        />
      </>
    );
  },
};

export default webhookStripe;
