import React, { useRef, useMemo, useState } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Editor, { monaco } from "@monaco-editor/react";
import { useFiretableContext } from "contexts/firetableContext";
import { FieldType } from "constants/fields";
import { setTimeout } from "timers";

const useStyles = makeStyles(theme =>
  createStyles({
    editorWrapper: { position: "relative", minWidth: 800 },

    editor: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      resize: "both",
      fontFamily: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
      height: "350px",
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

  const [initialEditorValue] = useState(script ?? "");
  const { tableState } = useFiretableContext();
  const classes = useStyles();

  const editorRef = useRef<any>();

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
  }

  function listenEditorChanges() {
    setTimeout(() => {
      editorRef.current?.onDidChangeModelContent(ev => {
        handleChange(editorRef.current.getValue());
      });
    }, 2000);
  }

  useMemo(async () => {
    const firestoreDefs = await fetch(
      `${process.env.PUBLIC_URL}/firestore.d.ts`
    );
    // const res = await fetch(
    //   `https://www.gstatic.com/firebasejs/7.17.2/firebase-firestore.js`,
    //   { mode: "no-cors" }
    // );
    const firestoreDefsFile = await firestoreDefs.text();

    monaco
      .init()
      .then(monacoInstance => {
        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
          firestoreDefsFile
        );
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

        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
          [
            "    /**",
            "     * utility functions",
            "     */",
            "declare namespace utilFns {",
            "    /**",
            "     * Sends out an email through sendGrid",
            "     */",
            `function sendEmail(msg:{from: string,
              templateId:string,
              personalizations:{to:string,dynamic_template_data:any}[]}):void {

              }`,
            "}",
          ].join("\n")
        );

        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
          [
            "  const db:FirebaseFirestore.Firestore;",
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

        //  monacoInstance.editor.create(wrapper, properties);
      })
      .catch(error =>
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
        {/* <div id="editor" className={classes.editor} /> */}
        <Editor
          height="90vh"
          editorDidMount={handleEditorDidMount}
          language="javascript"
          value={initialEditorValue}
        />
      </div>
    </>
  );
}
