import { useState } from "react";
import Editor, { EditorProps } from "@monaco-editor/react";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { useTheme, Box, BoxProps } from "@mui/material";
import TrapFocus from "@mui/material/Unstable_TrapFocus";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import ResizeBottomRightIcon from "@src/assets/icons/ResizeBottomRight";

import useMonacoCustomizations, {
  IUseMonacoCustomizationsProps,
} from "./useMonacoCustomizations";
import FullScreenButton from "./FullScreenButton";

export interface ICodeEditorProps
  extends Partial<EditorProps>,
    Omit<IUseMonacoCustomizationsProps, "fullScreen"> {
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
  defaultLanguage = "javascript",
  ...props
}: ICodeEditorProps) {
  const theme = useTheme();

  // Store editor value to prevent code editor values not being saved when
  // Side Drawer is in the middle of a refresh
  const [initialEditorValue] = useState(value ?? "");
  const [fullScreen, setFullScreen] = useState(false);

  const { boxSx } = useMonacoCustomizations({
    minHeight,
    disabled,
    error,
    extraLibs,
    diagnosticsOptions,
    onUnmount,
    fullScreen,
  });

  const onValidate_: EditorProps["onValidate"] = (markers) => {
    onValidStatusUpdate?.({ isValid: markers.length <= 0, markers });
    onValidate?.(markers);
  };

  return (
    <TrapFocus open={fullScreen}>
      <Box
        sx={[
          boxSx,
          ...(Array.isArray(containerProps?.sx)
            ? containerProps!.sx
            : containerProps?.sx
            ? [containerProps.sx]
            : []),
        ]}
        style={fullScreen ? { height: "100%" } : {}}
      >
        <Editor
          defaultLanguage={defaultLanguage}
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

        <FullScreenButton
          onClick={() => setFullScreen((f) => !f)}
          active={fullScreen}
        />

        {!fullScreen && (
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
        )}
      </Box>
    </TrapFocus>
  );
}
