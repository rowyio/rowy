import React from "react";
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

  return (
    <Box marginBottom={1} display="flex" justifyContent="space-between">
      <Box>
        You have access to:{" "}
        <AvailableValueTag
          label="row"
          details={
            <>
              You have acces to the object "row" at the top level. Typing "row"
              in the code editor to get auto completion. Below are the fields of
              row you can use in this table:
              <br />
              <br />
              {Object.keys(tableState?.columns!).join(", ")}
            </>
          }
        />
        <AvailableValueTag
          label="db"
          details={`You have acces to the db object that represents the firestore database object. Typing "db" in the code editor to get auto completion.`}
        />
        <AvailableValueTag
          label="ref"
          details={`You have acces to the ref object that represents the referecne to the current row in firestore db. Typing "ref" in the code editor to get auto completion.`}
        />
        <AvailableValueTag
          label="auth"
          details={`You have acces to the auth object that represents firebase auth. Typing "auth" in the code editor to get auto completion.`}
        />
        <AvailableValueTag
          label="storage"
          details={`You have acces to the storage object that represents firebase storage. Typing "storage" in the code editor to get auto completion.`}
        />
        <AvailableValueTag
          label="utilFns"
          details={`You have acces to the utilFns object which has some helper methods. Typing "utilFns" in the code editor to get auto completion.`}
        />
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
