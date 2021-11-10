import { IWebhookModalStepProps } from "./WebhookModal";
import { useProjectContext } from "@src/contexts/ProjectContext";
import { FormControl, FormLabel, TextField, Typography } from "@mui/material";

export default function Step1Endpoint({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" className="visually-hidden">
        Secret
      </FormLabel>
      <TextField
        fullWidth
        value={webhookObject.secret}
        onChange={(e) =>
          setWebhookObject({ ...webhookObject, secret: e.target.value })
        }
      />
    </FormControl>
  );
}
