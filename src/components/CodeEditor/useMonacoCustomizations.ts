import { useEffect } from "react";
import { useAtom } from "jotai";
import { matchSorter } from "match-sorter";

import {
  tableScope,
  tableRowsAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { useMonaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor/esm/vs/editor/editor.api";

import { useTheme } from "@mui/material";
import type { SystemStyleObject, Theme } from "@mui/system";

import firestoreDefs from "./firestore.d.ts?raw";
import firebaseAuthDefs from "./firebaseAuth.d.ts?raw";
import firebaseStorageDefs from "./firebaseStorage.d.ts?raw";
import utilsDefs from "./utils.d.ts?raw";
import rowyUtilsDefs from "./rowy.d.ts?raw";
import extensionsDefs from "./extensions.d.ts?raw";
import { projectScope, secretNamesAtom } from "@src/atoms/projectScope";
import { getFieldProp } from "@src/components/fields";

export interface IUseMonacoCustomizationsProps {
  minHeight?: number;
  disabled?: boolean;
  error?: boolean;

  extraLibs?: string[];
  diagnosticsOptions?: languages.typescript.DiagnosticsOptions;
  onUnmount?: () => void;

  // Internal only
  fullScreen?: boolean;
}

export default function useMonacoCustomizations({
  minHeight,
  disabled,
  error,

  extraLibs,
  diagnosticsOptions = {
    noSemanticValidation: true,
    noSyntaxValidation: false,
  },
  onUnmount,

  fullScreen,
}: IUseMonacoCustomizationsProps) {
  const theme = useTheme();
  const monaco = useMonaco();
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [secretNames] = useAtom(secretNamesAtom, projectScope);

  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, []);

  useEffect(() => {
    if (!monaco) return;

    try {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        typeRoots: ["node_modules/@types"],
      });
      monaco.languages.typescript.typescriptDefaults.addExtraLib(firestoreDefs);
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        firebaseAuthDefs
      );
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        firebaseStorageDefs
      );
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        utilsDefs,
        "ts:filename/utils.d.ts"
      );
      monaco.languages.typescript.typescriptDefaults.addExtraLib(rowyUtilsDefs);
    } catch (error) {
      console.error(
        "An error occurred during initialization of Monaco: ",
        error
      );
    }
  }, [monaco]);

  // Initialize extraLibs from props
  useEffect(() => {
    if (!monaco) return;
    if (!extraLibs) return;
    try {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        extraLibs.join("\n"),
        "ts:filename/extraLibs.d.ts"
      );
    } catch (error) {
      console.error("Could not add extraLibs from props: ", error);
    }
  }, [monaco, extraLibs]);

  // Set diagnostics options
  const stringifiedDiagnosticsOptions = JSON.stringify(diagnosticsOptions);
  useEffect(() => {
    if (!monaco) return;

    try {
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        ...JSON.parse(stringifiedDiagnosticsOptions),
        diagnosticCodesToIgnore: [
          1323, // remove dynamic import error
          2307, // silence type declarations not found for dynamic import
        ],
      });
    } catch (error) {
      console.error("Could not set diagnostics options: ", error);
    }
  }, [monaco, stringifiedDiagnosticsOptions]);

  const setReplacementActions = () => {
    if (!monaco) return;
    const { dispose } = monaco.languages.registerCodeActionProvider(
      "javascript",
      {
        provideCodeActions: (model, range, context, token) => {
          const consoleLogReplacements = context.markers
            .filter((error) => {
              return error.message.includes("Rowy Cloud Logging");
            })
            .map((error) => {
              // first sentence of the message is "Replace with logging.[log/warn/error]"
              const firstSentence = error.message.split(":")[0];
              const replacement = firstSentence.split("with ")[1];
              return {
                title: firstSentence,
                diagnostics: [error],
                kind: "quickfix",
                edit: {
                  edits: [
                    {
                      resource: model.uri,
                      edit: {
                        range: error,
                        text: replacement,
                      },
                    },
                  ],
                },
                isPreferred: true,
              };
            });
          const secretNameReplacements = context.markers
            .filter((error) => {
              return error.message.includes(
                "is not assignable to parameter of type 'SecretNames'"
              );
            })
            .map((error) => {
              const typoSecretName = model
                .getLineContent(error.startLineNumber)
                .slice(error.startColumn, error.endColumn - 2);
              const similarSecretNames =
                matchSorter(secretNames.secretNames ?? [], typoSecretName) ??
                [];
              const otherSecretNames =
                secretNames.secretNames?.filter(
                  (secretName) => !similarSecretNames.includes(secretName)
                ) ?? [];
              return [
                ...similarSecretNames.map((secretName) => ({
                  title: `Replace with "${secretName}"`,
                  diagnostics: [error],
                  kind: "quickfix",
                  edit: {
                    edits: [
                      {
                        resource: model.uri,
                        edit: {
                          range: error,
                          text: `"${secretName}"`,
                        },
                      },
                    ],
                  },
                  isPreferred: true,
                })),
                ...otherSecretNames.map((secretName) => ({
                  title: `Replace with "${secretName}"`,
                  diagnostics: [error],
                  kind: "quickfix",
                  edit: {
                    edits: [
                      {
                        resource: model.uri,
                        edit: {
                          range: error,
                          text: `"${secretName}"`,
                        },
                      },
                    ],
                  },
                  isPreferred: false,
                })),
              ];
            })
            .flat();
          return {
            actions: [...consoleLogReplacements, ...secretNameReplacements],
            dispose: () => {},
          };
        },
      }
    );
    monaco.editor.onWillDisposeModel((model) => {
      // dispose code action provider when model is disposed
      // this makes sure code actions are not displayed multiple times
      dispose();
    });
  };
  const addJsonFieldDefinition = async (
    columnKey: string,
    interfaceName: string
  ) => {
    const samples = tableRows
      .map((row) => row[columnKey])
      .filter((entry) => entry !== undefined)
      .map((entry) => JSON.stringify(entry));
    monaco?.languages.typescript.typescriptDefaults.addExtraLib(
      `type ${interfaceName} = any;`
    );
    // if (!samples || samples.length === 0) {
    //   monaco?.languages.typescript.typescriptDefaults.addExtraLib(
    //     `type ${interfaceName} = any;`
    //   );
    //   return;
    // } else {
    // const jsonInput = jsonInputForTargetLanguage("typescript");
    // await jsonInput.addSource({
    //   name: interfaceName,
    //   samples,
    // });
    // const inputData = new InputData();
    // inputData.addInput(jsonInput);
    //   const result = await quicktype({
    //     inputData,
    //     lang: "typescript",
    //     rendererOptions: { "just-types": "true" },
    //   });
    //   const newLib = result.lines.join("\n").replaceAll("export ", "");
    //  monaco?.languages.typescript.typescriptDefaults.addExtraLib(newLib);
    //}
  };

  //TODO: types
  const setBaseDefinitions = () => {
    const rowDefinition =
      tableColumnsOrdered
        .map((column) => {
          const { type, key } = column;
          if (type === "JSON") {
            const interfaceName = key[0].toUpperCase() + key.slice(1);
            addJsonFieldDefinition(key, interfaceName);
            const def = `static "${key}": ${interfaceName}`;
            return def;
          }
          return `static "${key}": ${getFieldProp("dataType", type)}`;
        })
        .join(";\n") + ";";
    const availableFields = tableColumnsOrdered
      .map((key) => `"${key}"`)
      .join("|\n");

    monaco?.languages.typescript.typescriptDefaults.addExtraLib(
      ["/**", " * extensions type configuration", " */", extensionsDefs].join(
        "\n"
      ),
      "ts:filename/extensions.d.ts"
    );
    monaco?.languages.typescript.typescriptDefaults.addExtraLib(
      [
        "// basic types that are used in all places",
        "declare var require: any;",
        "declare var Buffer: any;",
        "const ref: FirebaseFirestore.DocumentReference;",
        "const storage: firebasestorage.Storage;",
        "const db: FirebaseFirestore.Firestore;",
        "const auth: firebaseauth.BaseAuth;",
        `type Row = {${rowDefinition}};`,
        `type Field = ${availableFields} | string | object;`,
        `type Fields = Field[];`,
      ].join("\n"),
      "ts:filename/rowFields.d.ts"
    );
  };
  //TODO: Set row definitions
  useEffect(() => {
    if (!monaco) return;
    try {
      setBaseDefinitions();
    } catch (error) {
      console.error("Could not set basic", error);
    }
  }, [monaco, tableColumnsOrdered]);

  useEffect(() => {
    if (!monaco) return;
    if (secretNames.loading) return;
    if (!secretNames.secretNames) return;
    const secretsDef = `type SecretNames = ${secretNames.secretNames
      .map((secret: string) => `"${secret}"`)
      .join(" | ")} \n
        enum secrets {
          ${secretNames.secretNames
            .map((secret: string) => `"${secret}" = "${secret}"`)
            .join("\n")}
        }
       `;
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(secretsDef);

    setReplacementActions();
  }, [monaco, secretNames]);

  let boxSx: SystemStyleObject<Theme> = {
    minWidth: 400,
    minHeight,
    height: minHeight,
    borderRadius: 1,
    resize: "vertical",
    overflow: "hidden",
    position: "relative",
    backgroundColor: disabled ? "transparent" : theme.palette.action.input,

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      pointerEvents: "none",
      borderRadius: "inherit",

      boxShadow: `0 -1px 0 0 ${theme.palette.text.disabled} inset,
                  0 0 0 1px ${theme.palette.action.inputOutline} inset`,
      transition: theme.transitions.create("box-shadow", {
        duration: theme.transitions.duration.short,
      }),
    },

    "&:hover::after": {
      boxShadow: `0 -1px 0 0 ${theme.palette.text.primary} inset,
                  0 0 0 1px ${theme.palette.action.inputOutline} inset`,
    },
    "&:focus-within::after": {
      boxShadow: `0 -2px 0 0 ${theme.palette.primary.main} inset,
                  0 0 0 1px ${theme.palette.action.inputOutline} inset`,
    },

    ...(error
      ? {
          "&::after, &:hover::after, &:focus-within::after": {
            boxShadow: `0 -2px 0 0 ${theme.palette.error.main} inset,
                        0 0 0 1px ${theme.palette.action.inputOutline} inset`,
          },
        }
      : {}),

    "& .editor": {
      // Overwrite user-select: none that causes editor
      // to not be focusable in Safari
      userSelect: "auto",
      height: "100%",
    },

    "& .monaco-editor, & .monaco-editor .margin, & .monaco-editor-background": {
      backgroundColor: "transparent",
    },
  };

  if (fullScreen)
    boxSx = {
      ...boxSx,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: theme.zIndex.tooltip * 2,
      m: "0 !important",
      resize: "none",
      backgroundColor: theme.palette.background.paper,

      borderRadius: 0,
      "&::after": { display: "none" },
    };

  return { boxSx };
}
