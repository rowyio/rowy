import { IWebhookModalStepProps } from "./WebhookModal";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { webhookSchemas } from "./utils";
export default function Step1Endpoint({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" className="visually-hidden">
        Verification
      </FormLabel>
      <FormControlLabel
        labelPlacement="start"
        control={
          <Switch
            checked={webhookObject.auth?.enabled}
            onClick={() =>
              setWebhookObject({
                ...webhookObject,
                auth: {
                  ...webhookObject.auth,
                  enabled: !webhookObject?.auth?.enabled,
                },
              })
            }
          />
        }
        label="Enable Verification"
      />
      {webhookObject.auth?.enabled ? (
        webhookSchemas[webhookObject.type].auth(webhookObject, setWebhookObject)
      ) : (
        <Typography>
          Verification of webhooks is optional however it prevents malicious
          actors from spoofing the original sender
        </Typography>
      )}
      {}
    </FormControl>
  );
}
