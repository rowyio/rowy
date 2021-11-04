import React from "react";
import { FieldType } from "@src/constants/fields";

export interface EditorContextInterface {
  // row: any;
  // onSubmit: any;
  // value: any;
  // anchorEl: any;
  editorValue: any;
  open: any;
  close: any;
  cancel: any;
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
  cancel: undefined,
  editorValue: undefined,
  setEditorValue: undefined,
  fieldType: null,
});

export default EditorContext;
