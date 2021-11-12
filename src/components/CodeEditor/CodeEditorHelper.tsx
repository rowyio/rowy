import { Stack, Typography, Grid, Tooltip, Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

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
    {
      key: "utilFns",
      description: `utilFns provides a set of functions that are commonly used, such as easy access to GCP Secret Manager`,
    },
  ];

  return (
    <Stack
      direction="row"
      alignItems="baseline"
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

      <Button
        size="small"
        color="primary"
        target="_blank"
        rel="noopener noreferrer"
        href={docLink}
        style={{ flexShrink: 0 }}
      >
        Examples & docs
        <InlineOpenInNewIcon />
      </Button>
    </Stack>
  );
}
