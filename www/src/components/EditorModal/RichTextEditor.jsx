import React, { useContext } from "react";

import EditorContext from "contexts/editorContext";
import RichText from "components/RichText";
import { FieldType } from "constants/fields";

import EditorModal from ".";

const RichTextEditor = props => {
  const editorContext = useContext(EditorContext);

  if (editorContext.fieldType !== FieldType.richText) return <></>;
  return (
    <EditorModal>
      <RichText
        value={editorContext.editorValue}
        onChange={val => editorContext.setEditorValue(val)}
      />
    </EditorModal>
  );
};
export default RichTextEditor;
