import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import {
  IWebhook,
  ISecret,
} from "@src/components/TableModals/WebhooksModal/utils";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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
  auth: (
    webhookObject: IWebhook,
    setWebhookObject: (w: IWebhook) => void,
    secrets: ISecret
  ) => {
    console.log(secrets);
    return (
      <>
        <Typography gutterBottom>
          Select or add your secret key in the format of{" "}
          <code>
            {"{" + `"publicKey":"pk_...","secretKey": "sk_..."` + "}"}
          </code>{" "}
          and get your{" "}
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

        <FormControl fullWidth margin={"normal"}>
          <InputLabel id="stripe-secret-key">Secret key</InputLabel>
          <Select
            labelId="stripe-secret-key"
            id="stripe-secret-key"
            label="Secret key"
            variant="filled"
            value={webhookObject.auth.secretKey}
            onChange={(e) => {
              setWebhookObject({
                ...webhookObject,
                auth: { ...webhookObject.auth, secretKey: e.target.value },
              });
            }}
          >
            {secrets.keys.map((secret) => {
              return <MenuItem value={secret}>{secret}</MenuItem>;
            })}
            <MenuItem
              onClick={() => {
                const secretManagerLink = `https://console.cloud.google.com/security/secret-manager/create?project=${secrets.projectId}`;
                window?.open?.(secretManagerLink, "_blank")?.focus();
              }}
            >
              Add a key in Secret Manager
            </MenuItem>
          </Select>
        </FormControl>
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
