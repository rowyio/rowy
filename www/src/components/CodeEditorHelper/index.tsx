import { useFiretableContext } from "contexts/FiretableContext";
import { Box, Tooltip, Button, Chip } from "@material-ui/core";
import OpenIcon from "@material-ui/icons/OpenInNew";

function AvailableValueTag({ label, details }) {
  return (
    <Tooltip
      style={{
        zIndex: 9999,
        marginRight: 4,
      }}
      title={<>{details}</>}
    >
      <Chip label={label} size="small" />
    </Tooltip>
  );
}

/* TODO implement parameter "tags" that defines available tags and values
{
    row: "You have access to the object 'row' at...",
    ref: "...",
    ...: ...
}
*/
export default function CodeEditorHelper({ docLink }) {
  const { tableState } = useFiretableContext();
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
    <Box marginBottom={1} display="flex" justifyContent="space-between">
      <Box>
        You have access to:{" "}
        {availableVariables.map((v) => (
          <AvailableValueTag label={v.key} details={v.description} />
        ))}
      </Box>
      <Button
        size="small"
        endIcon={<OpenIcon />}
        target="_blank"
        href={docLink}
      >
        Examples & Docs
      </Button>
    </Box>
  );
}
