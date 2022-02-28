import {
  Stack,
  Typography,
  Grid,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import SecretsIcon from "@mui/icons-material/VpnKeyOutlined";
import FunctionsIcon from "@mui/icons-material/CloudOutlined";
import DocsIcon from "@mui/icons-material/DescriptionOutlined";
import { useAppContext } from "@src/contexts/AppContext";

export interface ICodeEditorHelperProps {
  docLink: string;
  additionalVariables?: {
    key: string;
    description: string;
  }[];
}

export default function CodeEditorHelper({
  docLink,
  additionalVariables,
}: ICodeEditorHelperProps) {
  const { projectId } = useAppContext();
  const availableVariables = [
    {
      key: "row",
      description: `row has the value of doc.data() it has type definitions using this table's schema, but you can access any field in the document.`,
    },
    {
      key: "db",
      description: `db object provides access to firestore database instance of this project. giving you access to any collection or document in this firestore instance`,
    },
    {
      key: "ref",
      description: `ref object that represents the reference to the current row in firestore db (ie: doc.ref).`,
    },
    {
      key: "auth",
      description: `auth provides access to a firebase auth instance, can be used to manage auth users or generate tokens.`,
    },
    {
      key: "storage",
      description: `firebase Storage can be accessed through this, storage.bucket() returns default storage bucket of the firebase project.`,
    },
  ];

  return (
    <Stack
      direction="row"
      alignItems="baseline"
      justifyItems="space-between"
      spacing={1}
      justifyContent="space-between"
      sx={{ my: 1 }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ mr: 0.5 }}>
        Available:
      </Typography>

      <Grid container spacing={1}>
        {availableVariables.concat(additionalVariables ?? []).map((v) => (
          <Grid item key={v.key}>
            <Tooltip title={v.description}>
              <code>{v.key}</code>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={1} direction="row" justifyContent={"flex-end"}>
        <Tooltip title="Open Secret Manager">
          <IconButton
            size="small"
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://console.cloud.google.com/security/secret-manager?project=${projectId}`}
            aria-label="secret manager"
          >
            <SecretsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Configure Cloud function">
          <IconButton
            size="small"
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
            //href={`https://console.cloud.google.com/functions/list?project=${projectId}`}
            href={`https://console.cloud.google.com/functions/edit/us-central1/R-lwj?env=gen1&project=${projectId}`}
            aria-label="Cloud function"
          >
            <FunctionsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Examples & documentation">
          <IconButton
            size="small"
            color="primary"
            target="_blank"
            rel="noopener noreferrer"
            href={docLink}
            aria-label="documentation"
          >
            <DocsIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      {/* <Button
        size="small"
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
        href={docLink}
        style={{ flexShrink: 0 }}
      >
        Examples & docs
        <InlineOpenInNewIcon />
      </Button> */}
    </Stack>
  );
}
