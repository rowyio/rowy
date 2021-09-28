import { useRef, useMemo, useState } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useProjectContext } from "contexts/ProjectContext";
import { FieldType } from "constants/fields";
import { useEffect } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    editorWrapper: {
      position: "relative",
      minWidth: 400,
      minHeight: 100,
      height: "calc(100% - 50px)",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      overflow: "hidden",
    },

    saveButton: {
      marginTop: theme.spacing(1),
    },
    editor: {
      // overwrite user-select: none that causes editor not focusable in Safari
      userSelect: "auto",
    },
  })
);

export default function CodeEditor(props: any) {
  const {
    handleChange,
    extraLibs,
    height = 400,
    script,
    onValideStatusUpdate,
    diagnosticsOptions,
    onUnmount,
    onMount,
  } = props;
  const theme = useTheme();
  const monacoInstance = useMonaco();

  const [initialEditorValue] = useState(script ?? "");
  const { tableState } = useProjectContext();
  const classes = useStyles();

  const editorRef = useRef<any>();

  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, []);

  function handleEditorDidMount(_, editor) {
    editorRef.current = editor;
    onMount?.();
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

    const firestoreDefsFile = await fetch(
      `${process.env.PUBLIC_URL}/firestore.d.ts`
    );
    const firebaseAuthDefsFile = await fetch(
      `${process.env.PUBLIC_URL}/auth.d.ts`
    );
    const firebaseStorageDefsFile = await fetch(
      `${process.env.PUBLIC_URL}/storage.d.ts`
    );
    const firestoreDefs = await firestoreDefsFile.text();
    const firebaseStorageDefs = await firebaseStorageDefsFile.text();
    const firebaseAuthDefs = (await firebaseAuthDefsFile.text())
      ?.replace("export", "declare")
      ?.replace("admin.auth", "adminauth");

    try {
      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        firestoreDefs
      );
      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        firebaseAuthDefs
      );
      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        firebaseStorageDefs
      );
      monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
        diagnosticsOptions ?? {
          noSemanticValidation: true,
          noSyntaxValidation: false,
        }
      );
      // compiler options
      monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions(
        {
          target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
          allowNonTsExtensions: true,
        }
      );
      if (extraLibs) {
        monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
          extraLibs.join("\n"),
          "ts:filename/extraLibs.d.ts"
        );
      }
      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        [
          "    /**",
          "     * utility functions",
          "     */",
          `
          declare namespace utilFns {
            /**
             * Sends out an email through sendGrid
             */
            function sendEmail(msg: {
              from: string;
              templateId: string;
              personalizations: { to: string; dynamic_template_data: any }[];
            }): void {}
          
            /**
             * Gets the secret defined in Google Cloud Secret
             */
            async function getSecret(name: string, v?: string): any {}
          
            /**
             * Async version of forEach
             */
            async function asyncForEach(array: any[], callback: Function): void {}
          
            /**
             * Generate random ID from numbers and English characters including lowercase and uppercase
             */
            function generateId(): string {}
          
            /**
             * Add an item to an array field
             */
            function arrayUnion(val: string): void {}

            /**
             * Remove an item to an array field
             */
            function arrayRemove(val: string): void {}

            /**
             * Increment a number field
             */
            function increment(val: number): void {}

            function hasRequiredFields(requiredFields: string[], data: any): boolean {}
          
            function hasAnyRole(
              authorizedRoles: string[],
              context: functions.https.CallableContext
            ): boolean {}
          }
          
          `,
        ].join("\n"),
        "ts:filename/utils.d.ts"
      );

      const rowDefinition = [
        ...Object.keys(tableState?.columns!).map((columnKey: string) => {
          const column = tableState?.columns[columnKey];
          switch (column.type) {
            case FieldType.shortText:
            case FieldType.longText:
            case FieldType.email:
            case FieldType.phone:
            case FieldType.code:
              return `${columnKey}:string`;
            case FieldType.singleSelect:
              const typeString = [
                ...(column.config?.options?.map((opt) => `"${opt}"`) ?? []),
              ].join(" | ");
              return `${columnKey}:${typeString}`;
            case FieldType.multiSelect:
              return `${columnKey}:string[]`;
            case FieldType.checkbox:
              return `${columnKey}:boolean`;
            default:
              return `${columnKey}:any`;
          }
        }),
      ].join(";\n");

      const availableFields = Object.keys(tableState?.columns!)
        .map((columnKey: string) => `"${columnKey}"`)
        .join("|\n");

      const extensionsDefinition = `
        // basic types that are used in all places
        type Row = {${rowDefinition}};
        type Field = ${availableFields} | string | object;
        type Fields = Field[];
        type Trigger = "create" | "update" | "delete";
        type Triggers = Trigger[];

        // function types that defines extension body and should run
        type Condition = boolean | ((data: ExtensionContext) => boolean | Promise<boolean>);
      
        // the argument that the extension body takes in
        type ExtensionContext = {
          row: Row;
          ref:FirebaseFirestore.DocumentReference;
          storage:firebasestorage.Storage;
          db:FirebaseFirestore.Firestore;
          auth:adminauth.BaseAuth;
          change: any;
          triggerType: Triggers;
          fieldTypes: any;
          extensionConfig: {
            label: string;
            type: string;
            triggers: Trigger[];
            conditions: Condition;
            requiredFields: string[];
            extensionBody: any;
          };
          utilFns: any;
        }

        // extension body definition
        type slackEmailBody = {
          channels?: string[];
          text?: string;
          emails: string[];
          blocks?: object[];
          attachments?: any;
        }

        type slackChannelBody = {
          channels: string[];
          text?: string;
          emails?: string[];
          blocks?: object[];
          attachments?: any;
        }

        type DocSyncBody = (context: ExtensionContext) => Promise<{
          fieldsToSync: Fields;
          row: Row;
          targetPath: string;
        }>

        type HistorySnapshotBody = (context: ExtensionContext) => Promise<{
          trackedFields: Fields;
        }>

        type AlgoliaIndexBody = (context: ExtensionContext) => Promise<{
          fieldsToSync: Fields;
          index: string;
          row: Row;
          objectID: string;
        }>

        type MeiliIndexBody = (context: ExtensionContext) => Promise<{
          fieldsToSync: Fields;
          index: string;
          row: Row;
          objectID: string;
        }>

        type BigqueryIndexBody = (context: ExtensionContext) => Promise<{
          fieldsToSync: Fields;
          index: string;
          row: Row;
          objectID: string;
        }>

        type SlackMessageBody = (context: ExtensionContext) => Promise<slackEmailBody | slackChannelBody>;

        type SendgridEmailBody = (context: ExtensionContext) => Promise<any>;

        type ApiCallBody = (context: ExtensionContext) => Promise<{
          body: string;
          url: string;
          method: string;
          callback: any;
        }>

        type TwilioMessageBody = (context: ExtensionContext) => Promise<{
          body: string;
          from: string;
          to: string;
        }>

        type TaskBody = (context: ExtensionContext) => Promise<any>
      `;

      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        [
          "    /**",
          "     * extensions type configuration",
          "     */",
          extensionsDefinition,
        ].join("\n"),
        "ts:filename/extensions.d.ts"
      );

      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        [
          "  declare var require: any;",
          "  declare var Buffer: any;",
          "  const ref:FirebaseFirestore.DocumentReference",
          "  const storage:firebasestorage.Storage",
          "  const db:FirebaseFirestore.Firestore;",
          "  const auth:adminauth.BaseAuth;",
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
                  ...(column.config?.options?.map((opt) => `"${opt}"`) ?? []),
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
    } catch (error) {
      console.error(
        "An error occurred during initialization of Monaco: ",
        error
      );
    }
  }, [tableState?.columns, monacoInstance]);

  function handleEditorValidation(markers) {
    if (onValideStatusUpdate) {
      onValideStatusUpdate({
        isValid: markers.length <= 0,
      });
    }
  }

  return (
    <>
      <div className={classes.editorWrapper}>
        <Editor
          theme={themeTransformer(theme.palette.mode)}
          onMount={handleEditorDidMount}
          language="javascript"
          height={height}
          value={initialEditorValue}
          onChange={handleChange}
          onValidate={handleEditorValidation}
          options={{
            // readOnly: disabled,
            fontFamily: theme.typography.fontFamilyMono,
            rulers: [80],
            minimap: { enabled: false },
            // ...editorOptions,
          }}
          className={classes.editor}
        />
      </div>
    </>
  );
}
