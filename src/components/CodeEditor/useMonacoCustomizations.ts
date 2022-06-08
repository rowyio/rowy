import { useEffect } from "react";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";
import { useAtom } from "jotai";

import {
  tableScope,
  tableRowsAtom,
  tableColumnsOrderedAtom,
} from "@src/atoms/tableScope";
import { useMonaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor/esm/vs/editor/editor.api";
import githubLightTheme from "./github-light-default.json";
import githubDarkTheme from "./github-dark-default.json";

import { useTheme } from "@mui/material";
import type { SystemStyleObject, Theme } from "@mui/system";

// TODO:
// import { getFieldType, getFieldProp } from "@src/components/fields";

/* eslint-disable import/no-webpack-loader-syntax */
import firestoreDefs from "!!raw-loader!./firestore.d.ts";
import firebaseAuthDefs from "!!raw-loader!./firebaseAuth.d.ts";
import firebaseStorageDefs from "!!raw-loader!./firebaseStorage.d.ts";
import utilsDefs from "!!raw-loader!./utils.d.ts";
import rowyUtilsDefs from "!!raw-loader!./rowy.d.ts";
import extensionsDefs from "!!raw-loader!./extensions.d.ts";
import { runRoutes } from "@src/constants/runRoutes";
import { rowyRunAtom, globalScope } from "@src/atoms/globalScope";
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
  const [rowyRun] = useAtom(rowyRunAtom, globalScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, []);

  // Initialize theme
  useEffect(() => {
    if (!monaco) {
      // useMonaco returns a monaco instance but initialisation is done asynchronously
      // dont execute the logic until the instance is initialised
      return;
    }

    setTimeout(() => {
      try {
        monaco.editor.defineTheme("github-light", githubLightTheme as any);
        monaco.editor.defineTheme("github-dark", githubDarkTheme as any);
        monaco.editor.setTheme("github-" + theme.palette.mode);
      } catch (error) {
        console.error("Could not set Monaco theme: ", error);
      }
    });
  }, [monaco, theme.palette.mode]);

  // Initialize external libs & TypeScript compiler options
  useEffect(() => {
    if (!monaco) return;

    try {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(firestoreDefs);
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        firebaseAuthDefs
      );
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        firebaseStorageDefs
      );
      // Compiler options
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
      });
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        utilsDefs,
        "ts:filename/utils.d.ts"
      );
      monaco.languages.typescript.javascriptDefaults.addExtraLib(rowyUtilsDefs);
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
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
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
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
        JSON.parse(stringifiedDiagnosticsOptions)
      );
    } catch (error) {
      console.error("Could not set diagnostics options: ", error);
    }
  }, [monaco, stringifiedDiagnosticsOptions]);

  const addJsonFieldDefinition = async (
    columnKey: string,
    interfaceName: string
  ) => {
    const samples = tableRows
      .map((row) => row[columnKey])
      .filter((entry) => entry !== undefined)
      .map((entry) => JSON.stringify(entry));
    if (!samples || samples.length === 0) {
      monaco?.languages.typescript.javascriptDefaults.addExtraLib(
        `type ${interfaceName} = any;`
      );
      return;
    } else {
      //const jsonInput = jsonInputForTargetLanguage("typescript");
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
      //  monaco?.languages.typescript.javascriptDefaults.addExtraLib(newLib);
    }
  };

  const setSecrets = async () => {
    // set secret options
    try {
      const listSecrets = await rowyRun({
        route: runRoutes.listSecrets,
      });
      const secretsDef = `type SecretNames = ${listSecrets
        .map((secret: string) => `"${secret}"`)
        .join(" | ")}
        enum secrets {
          ${listSecrets
            .map((secret: string) => `${secret} = "${secret}"`)
            .join("\n")}
        }
        `;
      monaco?.languages.typescript.javascriptDefaults.addExtraLib(secretsDef);
    } catch (error) {
      console.error("Could not set secret definitions: ", error);
    }
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

    monaco?.languages.typescript.javascriptDefaults.addExtraLib(
      ["/**", " * extensions type configuration", " */", extensionsDefs].join(
        "\n"
      ),
      "ts:filename/extensions.d.ts"
    );
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(
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
    // set available secrets from secretManager
    try {
      setSecrets();
    } catch (error) {
      console.error("Could not set secrets: ", error);
    }
  }, [monaco, tableColumnsOrdered]);

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
