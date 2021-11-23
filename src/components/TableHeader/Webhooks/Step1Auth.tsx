import { IWebhookModalStepProps } from "./WebhookModal";
import { FormControl, FormLabel } from "@mui/material";
import { webhookSchemas } from "./utils";
export default function Step1Endpoint({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" className="visually-hidden">
        Auth
      </FormLabel>

      {webhookSchemas[webhookObject.type].auth(webhookObject, setWebhookObject)}
    </FormControl>
  );
}
