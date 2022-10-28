import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { IWebhookModalStepProps } from "./WebhookModal";

import { FormControlLabel, Checkbox, Typography } from "@mui/material";

import {
  projectIdAtom,
  projectScope,
  rowyRunAtom,
} from "@src/atoms/projectScope";
import { runRoutes } from "@src/constants/runRoutes";
import { webhookSchemas, ISecret } from "./utils";

export default function Step1Endpoint({
  webhookObject,
  setWebhookObject,
}: IWebhookModalStepProps) {
  const [rowyRun] = useAtom(rowyRunAtom, projectScope);
  const [projectId] = useAtom(projectIdAtom, projectScope);
  const [secrets, setSecrets] = useState<ISecret>({
    loading: true,
    keys: [],
    projectId,
  });

  useEffect(() => {
    rowyRun({
      route: runRoutes.listSecrets,
    }).then((secrets) => {
      setSecrets({
        loading: false,
        keys: secrets as string[],
        projectId,
      });
    });
  }, []);

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
        webhookSchemas[webhookObject.type].auth(
          webhookObject,
          setWebhookObject,
          secrets
        )}
      {}
    </>
  );
}
