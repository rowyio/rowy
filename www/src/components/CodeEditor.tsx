import React, { useRef, useMemo, useState } from "react";
import clsx from "clsx";
import Editor, { monaco } from "@monaco-editor/react";

import { useTheme, createStyles, makeStyles } from "@material-ui/core/styles";

import { useFiretableContext } from "contexts/FiretableContext";

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

export interface ICodeEditorProps {
  onChange: (value: string) => void;
  value: string;
  height?: number;
  wrapperProps?: Partial<React.HTMLAttributes<HTMLDivElement>>;
  disabled?: boolean;
  editorOptions?: any;
}

export default function CodeEditor({
  onChange,
  value,
  height = 400,
  wrapperProps,
  disabled,
  editorOptions,
}: ICodeEditorProps) {
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
    <div
      {...wrapperProps}
      className={clsx(classes.editorWrapper, wrapperProps?.className)}
    >
      <Editor
        theme={theme.palette.type}
        height={height}
        editorDidMount={handleEditorDidMount}
        language="javascript"
        value={initialEditorValue}
        options={{
          readOnly: disabled,
          fontFamily: theme.typography.fontFamilyMono,
          ...editorOptions,
        }}
      />
    </div>
  );
}
