import React, { useState, useEffect } from "react";
import { FieldProps } from "formik";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import ErrorMessage from "../ErrorMessage";
import { Button } from "@material-ui/core";

export default function Code({ form, field }: FieldProps) {
  const [localValue, setLocalValue] = useState(field.value);
  useEffect(() => {
    if (field.value !== localValue) setLocalValue(field.value);
  }, [field.value]);
  const autoSave = false;
  const handleChange = autoSave
    ? value => form.setFieldValue(field.name, value)
    : value => setLocalValue(value);

  return (
    <>
      <AceEditor
        key={`${form.initialValues.id}-${field.name}`}
        placeholder="insert code"
        mode="javascript"
        theme="monokai"
        name={field.name}
        //onLoad={this.onLoad}
        onChange={handleChange}
        fontSize={14}
        showPrintMargin={true}
        height={"150px"}
        //showGutter={true}
        highlightActiveLine={true}
        value={autoSave ? field.value : localValue}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      {!autoSave && field.value !== localValue && (
        <Button
          onClick={() => {
            form.setFieldValue(field.name, localValue);
          }}
        >
          Save Changes
        </Button>
      )}
      <ErrorMessage name={field.name} />
    </>
  );
}
