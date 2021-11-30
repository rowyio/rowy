import { useEffect } from "react";

import { useMonaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor/esm/vs/editor/editor.api";
import githubLightTheme from "./github-light-default.json";
import githubDarkTheme from "./github-dark-default.json";

import { useTheme } from "@mui/material";
import type { SystemStyleObject, Theme } from "@mui/system";

import { useProjectContext } from "@src/contexts/ProjectContext";
import { getFieldProp } from "@src/components/fields";

/* eslint-disable import/no-webpack-loader-syntax */
import firestoreDefs from "!!raw-loader!./firestore.d.ts";
import firebaseAuthDefs from "!!raw-loader!./firebaseAuth.d.ts";
import firebaseStorageDefs from "!!raw-loader!./firebaseStorage.d.ts";
import utilsDefs from "!!raw-loader!./utils.d.ts";
import extensionsDefs from "!!raw-loader!./extensions.d.ts";

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
  const { tableState } = useProjectContext();

  const monaco = useMonaco();

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

  // Set row definitions
  useEffect(() => {
    if (!monaco) return;

    try {
      const rowDefinition =
        Object.keys(tableState?.columns!)
          .map((columnKey: string) => {
            const column = tableState?.columns[columnKey];
            return `static "${columnKey}": ${getFieldProp(
              "dataType",
              column.type
            )}`;
          })
          .join(";\n") + ";";

      const availableFields = Object.keys(tableState?.columns!)
        .map((columnKey: string) => `"${columnKey}"`)
        .join("|\n");

      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        [
          "/**",
          " * extensions type configuration",
          " */",
          "// basic types that are used in all places",
          `type Row = {${rowDefinition}};`,
          `type Field = ${availableFields} | string | object;`,
          `type Fields = Field[];`,
          extensionsDefs,
        ].join("\n"),
        "ts:filename/extensions.d.ts"
      );

      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        [
          "declare var require: any;",
          "declare var Buffer: any;",
          "const ref: FirebaseFirestore.DocumentReference;",
          "const storage: firebasestorage.Storage;",
          "const db: FirebaseFirestore.Firestore;",
          "const auth: adminauth.BaseAuth;",
          "declare class row {",
          "    /**",
          "     * Returns the row fields",
          "     */",
          rowDefinition,
          "}",
        ].join("\n"),
        "ts:filename/rowFields.d.ts"
      );
    } catch (error) {
      console.error("Could not set row definitions: ", error);
    }
  }, [monaco, tableState?.columns]);

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
      zIndex: theme.zIndex.tooltip + 1,
      m: "0 !important",
      resize: "none",
      backgroundColor: theme.palette.background.paper,

      borderRadius: 0,
      "&::after": { display: "none" },
    };

  return { boxSx };
}
