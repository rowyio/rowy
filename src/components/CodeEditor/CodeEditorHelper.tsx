import { useAtom } from "jotai";

import { Stack, Typography, Grid, Tooltip, IconButton } from "@mui/material";
import SecretsIcon from "@mui/icons-material/VpnKeyOutlined";
import FunctionsIcon from "@mui/icons-material/CloudOutlined";
import DocsIcon from "@mui/icons-material/DescriptionOutlined";

import { projectScope, projectIdAtom } from "@src/atoms/projectScope";

export interface ICodeEditorHelperProps {
  docLink: string;
  disableDefaultVariables?: boolean;
  disableSecretManagerLink?: boolean;
  disableCloudManagerLink?: boolean;
  additionalVariables?: {
    key: string;
    description: string;
  }[];
}

export default function CodeEditorHelper({
  docLink,
  disableDefaultVariables,
  disableSecretManagerLink,
  disableCloudManagerLink,
  additionalVariables,
}: ICodeEditorHelperProps) {
  const [projectId] = useAtom(projectIdAtom, projectScope);

  const availableVariables = disableDefaultVariables
    ? []
    : [
        {
          key: "db",
          description: `db object provides access to firestore database instance of this project. giving you access to any collection or document in this firestore instance`,
        },
        {
          key: "auth",
          description: `auth provides access to a firebase auth instance, can be used to manage auth users or generate tokens.`,
        },
        {
          key: "storage",
          description: `firebase Storage can be accessed through this, storage.bucket() returns default storage bucket of the firebase project.`,
        },
        {
          key: "rowy",
          description: `rowy provides a set of functions that are commonly used, such as easy file uploads & access to GCP Secret Manager`,
        },
        {
          key: "logging",
          description: `logging.log is encouraged to replace console.log`,
        },
      ];

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyItems="space-between"
      spacing={1}
      justifyContent="space-between"
      sx={{ my: 1 }}
    >
      <Typography variant="body2" color="textSecondary">
        Available:
      </Typography>

      <Grid
        container
        spacing={1}
        style={{ flexGrow: 1, marginTop: -8, marginLeft: 0 }}
      >
        {availableVariables.concat(additionalVariables ?? []).map((v) => (
          <Grid item key={v.key}>
            <Tooltip title={v.description}>
              <code>{v.key}</code>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        style={{ marginTop: -4 }}
      >
        {!disableSecretManagerLink && (
          <Tooltip title="Secret Manager&nbsp;↗">
            <IconButton
              size="small"
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://console.cloud.google.com/security/secret-manager?project=${projectId}`}
            >
              <SecretsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {!disableCloudManagerLink && (
          <Tooltip title="Configure Cloud Function&nbsp;↗">
            <IconButton
              size="small"
              color="primary"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://console.cloud.google.com/functions/list?project=${projectId}`}
            >
              <FunctionsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Examples & documentation&nbsp;↗">
          <IconButton
            size="small"
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
            href={docLink}
          >
            <DocsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
