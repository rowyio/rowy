import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

import EditorModal from ".";
import ReactJson from "react-json-view";
const useStyles = makeStyles(theme =>
  createStyles({
    root: { minWidth: 400, maxHeight: 500, overflowY: "scroll" },
  })
);

const JsonEditor = props => {
  const classes = useStyles();
  const editorContext = useContext(EditorContext);

  const handleEdit = edit => {
    editorContext.setEditorValue(edit.updated_src);
  };
  if (editorContext.fieldType !== FieldType.json) return <></>;
  return (
    <EditorModal>
      <div className={classes.root}>
        <ReactJson
          theme="bright:inverted"
          src={editorContext.editorValue ? editorContext.editorValue : {}}
          onEdit={handleEdit}
          onAdd={handleEdit}
          onDelete={handleEdit}
        />
      </div>
    </EditorModal>
  );
};
export default JsonEditor;
