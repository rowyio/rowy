import { useState } from "react";
import Editor, { EditorProps } from "@monaco-editor/react";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { useTheme, Box, BoxProps } from "@mui/material";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import ResizeBottomRightIcon from "@src/assets/icons/ResizeBottomRight";

import useMonacoCustomizations, {
  IUseMonacoCustomizationsProps,
} from "./useMonacoCustomizations";

export interface ICodeEditorProps
  extends Partial<EditorProps>,
    IUseMonacoCustomizationsProps {
  value: string;
  containerProps?: Partial<BoxProps>;

  onValidate?: EditorProps["onValidate"];
  onValidStatusUpdate?: (result: {
    isValid: boolean;
    markers: editor.IMarker[];
  }) => void;
}

export default function CodeEditor({
  value,
  minHeight = 100,
  disabled,
  error,
  containerProps,

  onValidate,
  onValidStatusUpdate,

  extraLibs,
  diagnosticsOptions,
  onUnmount,

  ...props
}: ICodeEditorProps) {
  const theme = useTheme();

  // Store editor value to prevent code editor values not being saved when
  // Side Drawer is in the middle of a refresh
  const [initialEditorValue] = useState(value ?? "");

  const { boxSx } = useMonacoCustomizations({
    minHeight,
    disabled,
    error,
    extraLibs,
    diagnosticsOptions,
    onUnmount,
  });

  const onValidate_: EditorProps["onValidate"] = (markers) => {
    onValidStatusUpdate?.({ isValid: markers.length <= 0, markers });
    onValidate?.(markers);
  };

  return (
    <Box sx={{ ...boxSx, ...containerProps?.sx }}>
      <Editor
        defaultLanguage="javascript"
        value={initialEditorValue}
        loading={<CircularProgressOptical size={20} sx={{ m: 2 }} />}
        className="editor"
        {...props}
        onValidate={onValidate_}
        options={{
          readOnly: disabled,
          fontFamily: theme.typography.fontFamilyMono,
          rulers: [80],
          minimap: { enabled: false },
          lineNumbersMinChars: 4,
          lineDecorationsWidth: 0,
          automaticLayout: true,
          fixedOverflowWidgets: true,
          tabSize: 2,
          ...props.options,
        }}
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
