import { Typography, Link, TextField, Alert } from "@mui/material";
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
    ) => `const sendgridParser: Parser = async ({ req, db, ref, logging }) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  
  const event = req.body
  switch (event.type) {
    case "payment_intent.succeeded":
      break;
    case "payment_intent.payment_failed":
      break;
  default:
    // All other types
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}
};`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const condition: Condition = async({ref, req, db, logging}) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  
  return true;
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  auth: (
    webhookObject: IWebhook,
    setWebhookObject: (w: IWebhook) => void,
    secrets: ISecret
  ) => {
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

        {webhookObject.auth.secretKey &&
          !secrets.loading &&
          !secrets.keys.includes(webhookObject.auth.secretKey) && (
            <Alert severity="error" sx={{ height: "auto!important" }}>
              Your previously selected key{" "}
              <code>{webhookObject.auth.secretKey}</code> does not exist in
              Secret Manager. Please select your key again.
            </Alert>
          )}

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
