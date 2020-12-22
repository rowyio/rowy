import React, { useRef, useMemo, useState } from "react";
import { useTheme, createStyles, makeStyles } from "@material-ui/core/styles";
import Editor, { monaco } from "@monaco-editor/react";
import { useFiretableContext } from "contexts/FiretableContext";
import { setTimeout } from "timers";

const useStyles = makeStyles((theme) =>
  createStyles({
    editorWrapper: { position: "relative" },
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
  const { onChange, value, height = 400 } = props;
  const theme = useTheme();
  const [initialEditorValue] = useState(value ?? "");
  const { tableState } = useFiretableContext();
  const classes = useStyles();

  const editorRef = useRef<any>();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  function listenEditorChanges() {
    setTimeout(() => {
      editorRef.current?.onDidChangeModelContent((ev) => {

        onChange(editorRef.current.getValue());
      });
    }, 2000);
  }

  useMemo(async () => {
    monaco
      .init()
      .then((monacoInstance) => {
        monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
          {
            noSemanticValidation: true,
            noSyntaxValidation: false,
          }
        );
        // compiler options
        monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions(
          {
            target: monacoInstance.languages.typescript.ScriptTarget.ES5,
            allowNonTsExtensions: true,
          }
        );
      })
      .catch((error) =>
        console.error(
          "An error occurred during initialization of Monaco: ",
          error
        )
      );
    listenEditorChanges();
  }, [tableState?.columns]);
  return (
    <>
      <div className={classes.editorWrapper}>
        <Editor
          theme={theme.palette.type}
          height={height}
          editorDidMount={handleEditorDidMount}
          language="javascript"
          value={initialEditorValue}
        />
      </div>
    </>
  );
}
