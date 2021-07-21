import { useRef, useMemo, useState } from "react";
import { useTheme, createStyles, makeStyles } from "@material-ui/core/styles";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useFiretableContext } from "contexts/FiretableContext";
import { FieldType } from "constants/fields";

const useStyles = makeStyles((theme) =>
  createStyles({
    editorWrapper: {
      position: "relative",
      minWidth: 800,
      height: "calc(100% - 200px)",
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
  } = props;
  const theme = useTheme();
  const monacoInstance = useMonaco();

  const [initialEditorValue] = useState(script ?? "");
  const { tableState } = useFiretableContext();
  const classes = useStyles();

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
             * Generate random ID from numbers and English charactors inlcuding lowercase and uppercase
             */
            function generateId(): string {}
          
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

      const sparksDefinition = `declare namespace sparks {

        // basic types that are used in all places
        type Row = {${rowDefinition}};
        type Field = ${availableFields} | string | object;
        type Fields = Field[];
        type Trigger = "create" | "update" | "delete";
        type Triggers = Trigger[];
      
        // the argument that the spark body takes in
        type SparkContext = {
          row: Row;
          ref:FirebaseFirestore.DocumentReference;
          storage:firebasestorage.Storage;
          db:FirebaseFirestore.Firestore;
          auth:adminauth.BaseAuth;
          change: any;
          triggerType: Triggers;
          sparkConfig: any;
          utilFns: any;
        }
      
        // function types that defines spark body and shuold run
        type ShouldRun = boolean | ((data: SparkContext) => boolean | Promise<any>);
        type ContextToString = ((data: SparkContext) => string | Promise<any>);
        type ContextToStringList = ((data: SparkContext) => string[] | Promise<any>);
        type ContextToObject = ((data: SparkContext) => object | Promise<any>);
        type ContextToObjectList = ((data: SparkContext) => object[] | Promise<any>);
        type ContextToRow = ((data: SparkContext) => Row | Promise<any>);
        type ContextToAny = ((data: SparkContext) => any | Promise<any>);

        // different types of bodies that slack message can use
        type slackEmailBody = {
          channels?: ContextToStringList;
          text?: ContextToString;
          emails: ContextToStringList;
          blocks?: ContextToObjectList;
          attachments?: ContextToAny;
        }

        type slackChannelBody = {
          channels: ContextToStringList;
          text?: ContextToString;
          emails?: ContextToStringList;
          blocks?: ContextToObjectList;
          attachments?: ContextToAny;
        }
      
        // different types of sparks
        type docSync = {
          label?:string;
          type: "docSync";
          triggers: Triggers;
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            fieldsToSync: Fields;
            row: ContextToRow;
            targetPath: ContextToString;
          }
        };
      
        type historySnapshot = {
          label?:string;
          type: "historySnapshot";
          triggers: Triggers;
          shouldRun: ShouldRun;
          sparkBody: {
            trackedFields: Fields;
          }
        }
      
        type algoliaIndex = {
          label?:string; 
          type: "algoliaIndex"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            fieldsToSync: Fields;
            index: string;
            row: ContextToRow;
            objectID: ContextToString;
          }
        }
        
        type meiliIndex = { 
          type: "meiliIndex"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            fieldsToSync: Fields;
            index: string;
            row: ContextToRow;
            objectID: ContextToString;
          }
        }
        
        type bigqueryIndex = { 
          type: "bigqueryIndex"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            fieldsToSync: Fields;
            index: string;
            row: ContextToRow;
            objectID: ContextToString;
          }
        }

        type slackMessage = {
          label?:string; 
          type: "slackMessage"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: slackEmailBody | slackChannelBody;
        }
      
        type sendgridEmail = {
          label?:string;
          type: "sendgridEmail";
          triggers: Triggers;
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            msg: ContextToAny;
          }
        }
      
        type apiCall = {
          label?:string; 
          type: "apiCall"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            body: ContextToString;
            url: ContextToString;
            method: ContextToString;
            callback: ContextToAny;
          }
        }
      
        type twilioMessage = {
          label?:string;
          type: "twilioMessage";
          triggers: Triggers;
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            body: ContextToAny;
            from: ContextToAny;
            to: ContextToAny;
          }
        }

        type task = {
          label?:string; 
          type: "task"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            promises: ContextToAny;
          }
        }

        type mailchimp = {
          label?:string; 
          type: "mailchimp"; 
          triggers: Triggers; 
          shouldRun: ShouldRun;
          requiredFields?: Fields;
          sparkBody: {
            method: any;
            path: any;
            body: any;
          }
        }
      
        // an individual spark 
        type Spark =
          | docSync
          | historySnapshot
          | algoliaIndex
          | meiliIndex
          | bigqueryIndex
          | slackMessage
          | sendgridEmail
          | apiCall
          | twilioMessage
          | mailchimp
          | task;
      
        type Sparks = Spark[]
      
        // use spark.config(sparks) in the code editor for static type check
        function config(sparks: Sparks): void;
      }`;

      monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
        [
          "    /**",
          "     * sparks type configuration",
          "     */",
          sparksDefinition,
        ].join("\n"),
        "ts:filename/sparks.d.ts"
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
          theme={themeTransformer(theme.palette.type)}
          onMount={handleEditorDidMount}
          language="javascript"
          height={height}
          value={initialEditorValue}
          onChange={handleChange}
          onValidate={handleEditorValidation}
          className={classes.editor}
        />
      </div>
    </>
  );
}
