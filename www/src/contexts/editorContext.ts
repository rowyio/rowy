import React from "react";

export interface EditorContextInterface {
  // row: any;
  // onSubmit: any;
  // value: any;
  // anchorEl: any;
  editorValue: any;
  open: any;
  close: any;
  setEditorValue: any;
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
});

export default EditorContext;
