import { IWebhookModalStepProps } from "./WebhookModal";
import { useProjectContext } from "contexts/ProjectContext";
import { FormControl, FormLabel, TextField, Typography } from "@mui/material";

export default function Step1Endpoint({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  const { settings, tableState } = useProjectContext();
  return (
    <FormControl component="fieldset" required>
      <FormLabel component="legend" className="visually-hidden">
        Endpoint
      </FormLabel>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {" "}
        <Typography>
          {" "}
          {`${settings?.rowyRunUrl}/whs/${tableState?.tablePath}/`}
        </Typography>{" "}
        <TextField
          value={webhookObject.endpoint}
          onChange={(e) =>
            setWebhookObject({ ...webhookObject, endpoint: e.target.value })
          }
        />
      </div>
    </FormControl>
  );
}
