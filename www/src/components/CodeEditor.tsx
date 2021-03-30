import React, { useRef, useMemo, useState } from "react";
import clsx from "clsx";
import Editor, { useMonaco } from "@monaco-editor/react";

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
  const monacoInstance = useMonaco();

  const editorRef = useRef<any>();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  const themeTransformer = (theme: string) => {
    switch (theme) {
      case "dark":
        return "vs-dark";
      default:
        return theme;
    }
  };

  useMemo(async () => {
    if (!monacoInstance) {
      // useMonaco returns a monaco instance but initialisation is done asynchronously
      // dont execute the logic until the instance is initialised
      return;
    }

    try {
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
    } catch (error) {
      console.error(
        "An error occurred during initialization of Monaco: ",
        error
      );
    }
  }, [tableState?.columns]);

  return (
    <div
      {...wrapperProps}
      className={clsx(classes.editorWrapper, wrapperProps?.className)}
    >
      <Editor
        theme={themeTransformer(theme.palette.type)}
        height={height}
        onMount={handleEditorDidMount}
        language="javascript"
        value={initialEditorValue}
        options={{
          readOnly: disabled,
          fontFamily: theme.typography.fontFamilyMono,
          ...editorOptions,
        }}
        onChange={onChange as any}
      />
    </div>
  );
}
