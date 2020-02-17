import React, { useContext } from "react";

import { makeStyles, createStyles, TextField } from "@material-ui/core";

import EditorModal from ".";
import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      minWidth: 300,
    },
    multiline: { padding: theme.spacing(2.25, 1.5) },
  })
);

const LongTextEditor = () => {
  const classes = useStyles();

  const editorContext = useContext(EditorContext);
  if (editorContext.fieldType !== FieldType.longText) return <></>;

  return (
    <EditorModal>
      <TextField
        multiline
        variant="filled"
        rows={3}
        placeholder="Enter text here…"
        defaultValue={editorContext.editorValue}
        autoFocus
        onChange={(e: any) => {
          editorContext.setEditorValue(e.target.value);
        }}
        InputProps={{ classes }}
      />
    </EditorModal>
  );
};
export default LongTextEditor;
