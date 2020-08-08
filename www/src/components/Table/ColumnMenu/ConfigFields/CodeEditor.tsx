import React, { useRef } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/snippets/typescript";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/src-noconflict/ext-options";
import "ace-builds/src-noconflict/ext-settings_menu";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-spellcheck";
import "ace-builds/src-noconflict/ext-searchbox";
const useStyles = makeStyles(theme =>
  createStyles({
    editorWrapper: { position: "relative" },

    editor: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      resize: "both",

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

export default function CodeEditor(props: any) {
  const { handleChange, script } = props;
  const classes = useStyles();
  const editor = useRef<AceEditor>(null);
  const handleResize = () => {
    if (!editor.current) return;
    editor.current.editor.resize();
  };

  const annotations = [
    {
      row: 3, // must be 0 based
      column: 4, // must be 0 based
      text: "error.message", // text to show in tooltip
      type: "error",
    },
  ];
  return (
    <div className={classes.editorWrapper} onMouseUp={handleResize}>
      <AceEditor
        key={`column-code-editor`}
        placeholder="Type code here…"
        mode="javascript"
        theme="github"
        name={"code-editor"}
        onChange={handleChange}
        fontSize={13}
        width="100%"
        height="300px"
        showGutter
        highlightActiveLine
        showPrintMargin
        //annotations={annotations}
        value={script}
        enableBasicAutocompletion={true}
        enableSnippets={true}
        enableLiveAutocompletion={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          enableMultiselect: true,
          enableEmmet: true,
          cursorStyle: "wide",
        }}
        className={classes.editor}
        ref={editor}
      />
    </div>
  );
}
