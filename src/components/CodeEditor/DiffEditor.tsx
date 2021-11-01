import {
  DiffEditor as MonacoDiffEditor,
  DiffEditorProps,
  EditorProps,
} from "@monaco-editor/react";

import { useTheme, Box, BoxProps } from "@mui/material";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import ResizeBottomRightIcon from "@src/assets/icons/ResizeBottomRight";

import useMonacoCustomizations, {
  IUseMonacoCustomizationsProps,
} from "./useMonacoCustomizations";

export interface IDiffEditorProps
  extends Partial<DiffEditorProps>,
    IUseMonacoCustomizationsProps {
  onChange?: EditorProps["onChange"];
  containerProps?: Partial<BoxProps>;
}

export default function DiffEditor({
  onChange,
  minHeight = 100,
  disabled,
  error,
  containerProps,

  extraLibs,
  diagnosticsOptions,
  onUnmount,

  ...props
}: IDiffEditorProps) {
  const theme = useTheme();

  const { boxSx } = useMonacoCustomizations({
    minHeight,
    disabled,
    error,
    extraLibs,
    diagnosticsOptions,
    onUnmount,
  });

  // Needs manual patch since `onMount` prop is not available in `DiffEditor`
  // https://github.com/suren-atoyan/monaco-react/issues/281
  const handleEditorMount: DiffEditorProps["onMount"] = (editor, monaco) => {
    const modifiedEditor = editor.getModifiedEditor();
    modifiedEditor.onDidChangeModelContent((ev) => {
      onChange?.(modifiedEditor.getValue(), ev);
    });

    props.onMount?.(editor, monaco);
  };

  return (
    <Box sx={{ ...boxSx, ...containerProps?.sx }}>
      <MonacoDiffEditor
        language="javascript"
        loading={<CircularProgressOptical size={20} sx={{ m: 2 }} />}
        className="editor"
        {...props}
        onMount={handleEditorMount}
        options={
          {
            readOnly: disabled,
            fontFamily: theme.typography.fontFamilyMono,
            rulers: [80],
            minimap: { enabled: false },
            lineNumbersMinChars: 4,
            lineDecorationsWidth: "18",
            automaticLayout: true,
            fixedOverflowWidgets: true,
            tabSize: 2,
            ...props.options,
          } as any
        }
      />

      <ResizeBottomRightIcon
        aria-label="Resize code editor"
        color="action"
        sx={{
          position: "absolute",
          bottom: 1,
          right: 1,
          zIndex: 1,
        }}
      />
    </Box>
  );
}
