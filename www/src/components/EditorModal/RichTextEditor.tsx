import React, { useContext, lazy, Suspense } from "react";

import EditorContext from "contexts/editorContext";
import { FieldType } from "constants/fields";

import EditorModal from ".";
import { CircularProgress } from "@material-ui/core";
const RichText = lazy(() => import("components/RichText"));

export default function RichTextEditor() {
  const editorContext = useContext(EditorContext);

  if (editorContext.fieldType !== FieldType.richText) return <></>;
  return (
    <EditorModal>
      <Suspense fallback={<CircularProgress />}>
        <RichText
          value={editorContext.editorValue}
          onChange={val => editorContext.setEditorValue(val)}
        />
      </Suspense>
    </EditorModal>
  );
}
