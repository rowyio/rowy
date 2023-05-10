import { IWebhookModalStepProps } from "./WebhookModal";

import { FormControlLabel, Checkbox, Typography } from "@mui/material";

import { webhookSchemas } from "./utils";

export default function Step1Endpoint({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  return (
    <>
      <Typography variant="inherit" paragraph>
        Verification prevents malicious requests from being sent to this webhook
        endpoint
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
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
        label="Enable verification for this webhook"
        sx={{ mb: 2 }}
      />

      {webhookObject.auth?.enabled &&
        webhookSchemas[webhookObject.type].Auth(
          webhookObject,
          setWebhookObject
        )}
      {}
    </>
  );
}
