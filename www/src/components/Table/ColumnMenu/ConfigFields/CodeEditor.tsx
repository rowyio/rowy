import React, { useRef, useMemo } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { monaco } from "@monaco-editor/react";
import { useFiretableContext } from "contexts/firetableContext";
import { FieldType } from "constants/fields";

const useStyles = makeStyles(theme =>
  createStyles({
    editorWrapper: { position: "relative" },

    editor: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      resize: "both",
      fontFamily: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
      height: "400px",
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

  const { tableState } = useFiretableContext();
  console.log({ script });
  const classes = useStyles();

  const editorRef = useRef<any>();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  function listenEditorChanges() {
    editorRef.current?.onDidChangeModelContent(ev => {
      console.log(editorRef.current.getValue());
    });
  }

  useMemo(() => {
    console.log(tableState?.columns);
    monaco
      .init()
      .then(monacoInstance => {
        /* here is the instance of monaco, so you can use the `monaco.languages` or whatever you want */
        /* example below */

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
        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib();
        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
          [
            "declare class row {",
            "    /**",
            "     * Returns the row fields",
            "     */",
            ...Object.keys(tableState?.columns!).map((columnKey: string) => {
              const column = tableState?.columns[columnKey];
              switch (column.type) {
                case FieldType.shortText:
                case FieldType.longText:
                case FieldType.email:
                case FieldType.phone:
                case FieldType.code:
                  return `static ${columnKey}:string`;
                case FieldType.singleSelect:
                  const typeString = [
                    ...column.config.options.map(opt => `"${opt}"`),
                    //     "string",
                  ].join(" | ");
                  console.log(typeString);
                  return `static ${columnKey}:${typeString}`;
                case FieldType.multiSelect:
                  return `static ${columnKey}:string[]`;
                case FieldType.checkbox:
                  return `static ${columnKey}:boolean`;
                default:
                  return `static ${columnKey}:any`;
              }
            }),
            "}",
          ].join("\n"),
          "ts:filename/rowFields.d.ts"
        );

        let wrapper = document.getElementById("editor");
        let properties = {
          value: script,
          language: "javascript",
          //language: "typescript",
        };
        monacoInstance.editor.create(wrapper, properties);
      })
      .catch(error =>
        console.error(
          "An error occurred during initialization of Monaco: ",
          error
        )
      );
  }, [tableState?.columns]);

  return (
    <>
      <button onClick={listenEditorChanges} disabled={!!editorRef.current}>
        Press to listen editor changes (see console)
      </button>
      <div className={classes.editorWrapper}>
        <div id="editor" className={classes.editor} />
      </div>
    </>
  );
}
