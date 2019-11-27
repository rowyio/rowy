import React from "react";
import { FieldType } from "../components/Fields";

export interface EditorContextInterface {
  // row: any;
  // onSubmit: any;
  // value: any;
  // anchorEl: any;
  editorValue: any;
  open: any;
  close: any;
  setEditorValue: any;
  fieldType: FieldType | null;
}

const EditorContext = React.createContext<EditorContextInterface>({
  // row: undefined,
  // onSubmit: undefined,
  // value: undefined,
  // anchorEl: undefined,
  open: undefined,
  close: undefined,
  editorValue: undefined,
  setEditorValue: undefined,
  fieldType: null,
});

export default EditorContext;
