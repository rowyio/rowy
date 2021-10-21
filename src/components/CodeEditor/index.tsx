import { useState, useEffect } from "react";

import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor/esm/vs/editor/editor.api";
import githubLightTheme from "./github-light-default.json";
import githubDarkTheme from "./github-dark-default.json";

import { useTheme, Box, BoxProps } from "@mui/material";
import CircularProgressOptical from "components/CircularProgressOptical";
import ResizeBottomRightIcon from "assets/icons/ResizeBottomRight";

import { useProjectContext } from "contexts/ProjectContext";
import { getFieldProp } from "components/fields";

/* eslint-disable import/no-webpack-loader-syntax */
import firestoreDefs from "!!raw-loader!./firestore.d.ts";
import firebaseAuthDefs from "!!raw-loader!./firebaseAuth.d.ts";
import firebaseStorageDefs from "!!raw-loader!./firebaseStorage.d.ts";
import utilsDefs from "!!raw-loader!./utils.d.ts";
import extensionsDefs from "!!raw-loader!./extensions.d.ts";

export interface ICodeEditorProps extends Partial<EditorProps> {
  value: string;
  minHeight?: number;
  disabled?: boolean;
  containerProps?: Partial<BoxProps>;

  extraLibs?: string[];
  onValidate?: EditorProps["onValidate"];
  onValidStatusUpdate?: ({ isValid: boolean }) => void;
  diagnosticsOptions?: languages.typescript.DiagnosticsOptions;
  onUnmount?: () => void;
}

export default function CodeEditor({
  value,
  minHeight = 100,
  disabled,
  containerProps,

  extraLibs,
  onValidate,
  onValidStatusUpdate,
  diagnosticsOptions,
  onUnmount,

  ...props
}: ICodeEditorProps) {
  const theme = useTheme();
  const { tableState } = useProjectContext();

  const [initialEditorValue] = useState(value ?? "");
  const monaco = useMonaco();

  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, []);

  const onValidate_: EditorProps["onValidate"] = (markers) => {
    if (onValidStatusUpdate)
      onValidStatusUpdate({ isValid: markers.length <= 0 });
    else if (onValidate) onValidate(markers);
  };

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

  useEffect(() => {
    if (!monaco) {
      // useMonaco returns a monaco instance but initialisation is done asynchronously
      // dont execute the logic until the instance is initialised
      return;
    }

    try {
      monaco.editor.defineTheme("github-light", githubLightTheme as any);
      monaco.editor.defineTheme("github-dark", githubDarkTheme as any);

      monaco.languages.typescript.javascriptDefaults.addExtraLib(firestoreDefs);
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        firebaseAuthDefs
      );
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        firebaseStorageDefs
      );
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
        diagnosticsOptions ?? {
          noSemanticValidation: true,
          noSyntaxValidation: false,
        }
      );
      // compiler options
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
      });
      if (extraLibs) {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          extraLibs.join("\n"),
          "ts:filename/extraLibs.d.ts"
        );
      }
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        utilsDefs,
        "ts:filename/utils.d.ts"
      );

      const rowDefinition =
        Object.keys(tableState?.columns!)
          .map((columnKey: string) => {
            const column = tableState?.columns[columnKey];
            return `static ${columnKey}: ${getFieldProp("type", column.type)}`;
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
      console.error(
        "An error occurred during initialization of Monaco: ",
        error
      );
    }
  }, [tableState?.columns, monaco, diagnosticsOptions, extraLibs]);

  return (
    <Box
      sx={{
        minWidth: 400,
        minHeight,
        height: minHeight,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        resize: "vertical",
        overflow: "hidden",
        position: "relative",

        "& .editor": {
          // Overwrite user-select: none that causes editor
          // to not be focusable in Safari
          userSelect: "auto",
          height: "100%",
        },

        ...containerProps?.sx,
      }}
    >
      <Editor
        language="javascript"
        value={initialEditorValue}
        onValidate={onValidate_}
        loading={<CircularProgressOptical size={20} sx={{ m: 2 }} />}
        className="editor"
        {...props}
        options={{
          readOnly: disabled,
          fontFamily: theme.typography.fontFamilyMono,
          rulers: [80],
          minimap: { enabled: false },
          lineNumbersMinChars: 4,
          lineDecorationsWidth: 0,
          automaticLayout: true,
          fixedOverflowWidgets: true,
          ...props.options,
        }}
      />

      <ResizeBottomRightIcon
        aria-label="This code editor is resizable"
        color="action"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 1,
        }}
      />
    </Box>
  );
}
