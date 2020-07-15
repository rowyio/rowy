import React, { useState, useEffect, useRef } from "react";
import { FieldProps } from "formik";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import { makeStyles, createStyles, Button } from "@material-ui/core";
import ErrorMessage from "../ErrorMessage";
import CornerResizeIcon from "assets/icons/CornerResize";

const useStyles = makeStyles(theme =>
  createStyles({
    editorWrapper: { position: "relative" },

    editor: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      resize: "vertical",

      fontFamily: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
    },

    resizeIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,

      color: theme.palette.text.disabled,
    },

    saveButton: {
      marginTop: theme.spacing(1),
    },
  })
);

export default function Code({ form, field }: FieldProps) {
  const classes = useStyles();

  const [localValue, setLocalValue] = useState(field.value);
  useEffect(() => {
    if (field.value !== localValue) setLocalValue(field.value);
  }, [field.value]);

  const autoSave = false;
  const handleChange = autoSave
    ? value => form.setFieldValue(field.name, value)
    : value => setLocalValue(value);

  const editor = useRef<AceEditor>(null);
  const handleResize = () => {
    if (!editor.current) return;
    editor.current.editor.resize();
  };

  return (
    <>
      <div className={classes.editorWrapper} onMouseUp={handleResize}>
        <AceEditor
          key={`${form.initialValues.id}-${field.name}`}
          placeholder="Type code here…"
          mode="javascript"
          theme="github"
          name={field.name}
          //onLoad={this.onLoad}
          onChange={handleChange}
          fontSize={13}
          width="100%"
          height="150px"
          showGutter
          highlightActiveLine
          showPrintMargin
          value={autoSave ? field.value : localValue}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
          className={classes.editor}
          ref={editor}
        />
        <CornerResizeIcon className={classes.resizeIcon} />
      </div>

      {!autoSave && field.value !== localValue && (
        <Button
          onClick={() => {
            form.setFieldValue(field.name, localValue);
          }}
          className={classes.saveButton}
          variant="contained"
        >
          Save Changes
        </Button>
      )}

      <ErrorMessage name={field.name} />
    </>
  );
}
