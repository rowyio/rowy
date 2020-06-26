import React from "react";
import { FieldProps } from "formik";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import ErrorMessage from "../ErrorMessage";

export default function Code({ form, field }: FieldProps) {
  const handleChange = value => form.setFieldValue(field.name, value);

  return (
    <>
      <AceEditor
        key={`${form.initialValues.id}-${field.name}`}
        placeholder="insert code"
        mode="javascript"
        theme="monokai"
        //name="blah2"
        //onLoad={this.onLoad}
        onChange={handleChange}
        fontSize={14}
        showPrintMargin={true}
        height={"150px"}
        //showGutter={true}
        highlightActiveLine={true}
        value={field.value}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      <ErrorMessage name={field.name} />
    </>
  );
}
