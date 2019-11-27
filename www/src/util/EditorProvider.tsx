import React, { useState } from "react";
import EditorContext from "../contexts/editorContext";

interface IEditorProviderProps {
  children: React.ReactNode;
}
export const EditorProvider: React.FC<IEditorProviderProps> = ({
  children,
}) => {
  const [props, setProps] = useState<any>();
  const [editorValue, setEditorValue] = useState<null | string>(null);
  const close = () => {
    if (editorValue !== props.value) {
      props.onSubmit(editorValue);
    }
    setEditorValue(null);
  };
  const open = (props: {
    row: any;
    onSubmit: any;
    fieldName: string;
    value: string;
    anchorEl: any;
  }) => {
    setProps(props);
    setEditorValue(props.value);
  };
  return (
    <EditorContext.Provider
      value={{
        close,
        open,
        editorValue,
        setEditorValue,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
