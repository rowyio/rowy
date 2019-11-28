import React, { useState } from "react";
import EditorContext from "../contexts/editorContext";
import { FieldType } from "../components/Fields";

interface IEditorProviderProps {
  children: React.ReactNode;
}
export const EditorProvider: React.FC<IEditorProviderProps> = ({
  children,
}) => {
  const [fieldType, setFieldType] = useState<FieldType | null>(null);
  const [props, setProps] = useState<any>();
  const [editorValue, setEditorValue] = useState<null | string>(null);
  const close = () => {
    if (editorValue !== props.value) {
      props.onSubmit(editorValue);
    }
    setEditorValue(null);
    setFieldType(null);
    setProps(null);
  };
  const cancel = () => {
    setEditorValue(null);
    setFieldType(null);
    setProps(null);
  };
  const open = (
    props: {
      row: any;
      onSubmit: any;
      fieldName: string;
      value: string;
      anchorEl: any;
    },
    type: FieldType
  ) => {
    setFieldType(type);
    setProps(props);
    setEditorValue(props.value);
  };
  return (
    <EditorContext.Provider
      value={{
        cancel,
        close,
        open,
        fieldType,
        editorValue,
        setEditorValue,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
