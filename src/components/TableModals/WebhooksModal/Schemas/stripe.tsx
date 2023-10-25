import { useAtom } from "jotai";
import { Typography, Link, TextField, Alert, Box } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";
import {
  projectScope,
  secretNamesAtom,
  updateSecretNamesAtom,
  projectSettingsDialogAtom,
} from "@src/atoms/projectScope";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LoadingButton from "@mui/lab/LoadingButton";

export const webhookStripe = {
  name: "Stripe",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const stripeParser: Parser = async ({ req, db, ref, logging }) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("stripeParser started")
  
  // Import NPM package needed, some packages may not work in Webhooks
  // const {default: lodash} = await import("lodash");
  
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
  logging.log("condition started")
  
  return true;
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  Auth: (webhookObject: IWebhook, setWebhookObject: (w: IWebhook) => void) => {
    const [secretNames] = useAtom(secretNamesAtom, projectScope);
    const [updateSecretNames] = useAtom(updateSecretNamesAtom, projectScope);
    const [{ open, tab }, setProjectSettingsDialog] = useAtom(
      projectSettingsDialogAtom,
      projectScope
    );

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
          !secretNames.loading &&
          secretNames.secretNames &&
          !secretNames.secretNames.includes(webhookObject.auth.secretKey) && (
            <Alert severity="error" sx={{ height: "auto!important" }}>
              Your previously selected key{" "}
              <code>{webhookObject.auth.secretKey}</code> does not exist in
              Secret Manager. Please select your key again.
            </Alert>
          )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginY: 1,
          }}
        >
          <FormControl fullWidth>
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
              {secretNames.secretNames?.map((secret) => {
                return <MenuItem value={secret}>{secret}</MenuItem>;
              })}
              <MenuItem
                onClick={() => {
                  setProjectSettingsDialog({
                    open: true,
                  });
                }}
              >
                Add a key in Secret Manager
              </MenuItem>
            </Select>
          </FormControl>
          <LoadingButton
            sx={{
              height: "100%",
              marginLeft: 1,
            }}
            loading={secretNames.loading}
            onClick={() => {
              updateSecretNames?.();
            }}
          >
            Refresh
          </LoadingButton>
        </Box>
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
