import React, { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { IFieldProps } from "../utils";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

import { makeStyles, createStyles, Button } from "@material-ui/core";
import CornerResizeIcon from "assets/icons/CornerResize";

import { MONO_FONT } from "Theme";

const useStyles = makeStyles((theme) =>
  createStyles({
    editorWrapper: { position: "relative" },

    editor: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      resize: "vertical",

      fontFamily: MONO_FONT,
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

export interface IControlledCodeProps {
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  value: any;
}

function ControlledCode({ onChange, onBlur, value }: IControlledCodeProps) {
  const classes = useStyles();

  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    if (value !== localValue) setLocalValue(value);
  }, [value]);

  const autoSave = false;
  const handleChange = autoSave
    ? (value) => onChange(value)
    : (value) => setLocalValue(value);

  const editor = useRef<AceEditor>(null);
  const handleResize = () => {
    if (!editor.current) return;
    editor.current.editor.resize();
  };

  return (
    <>
      <div className={classes.editorWrapper} onMouseUp={handleResize}>
        <AceEditor
          placeholder="Type code here…"
          mode="javascript"
          theme="github"
          //onLoad={this.onLoad}
          onChange={handleChange}
          fontSize={13}
          width="100%"
          height="150px"
          showGutter
          highlightActiveLine
          showPrintMargin
          value={autoSave ? value : localValue}
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

      {!autoSave && value !== localValue && (
        <Button
          onClick={() => onChange(localValue)}
          className={classes.saveButton}
          variant="contained"
        >
          Save Changes
        </Button>
      )}
    </>
  );
}

export default function Code({ control, docRef, name, ...props }: IFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={(renderProps) => <ControlledCode {...props} {...renderProps} />}
    />
  );
}
