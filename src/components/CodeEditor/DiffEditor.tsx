import { useState } from "react";
import {
  DiffEditor as MonacoDiffEditor,
  DiffEditorProps,
  EditorProps,
} from "@monaco-editor/react";

import { useTheme, Box, BoxProps } from "@mui/material";
import TrapFocus from "@mui/material/Unstable_TrapFocus";
import CircularProgressOptical from "@src/components/CircularProgressOptical";
import { ResizeBottomRight } from "@src/assets/icons";

import useMonacoCustomizations, {
  IUseMonacoCustomizationsProps,
} from "./useMonacoCustomizations";
import FullScreenButton from "@src/components/FullScreenButton";
import { spreadSx } from "@src/utils/ui";
import githubLightTheme from "@src/components/CodeEditor/github-light-default.json";
import githubDarkTheme from "@src/components/CodeEditor/github-dark-default.json";

export interface IDiffEditorProps
  extends Partial<DiffEditorProps>,
    Omit<IUseMonacoCustomizationsProps, "fullScreen"> {
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
    <TrapFocus open={fullScreen}>
      <Box
        component="div"
        sx={[boxSx, ...spreadSx(containerProps?.sx)]}
        style={fullScreen ? { height: "100%" } : {}}
      >
        <MonacoDiffEditor
          language="javascript"
          loading={<CircularProgressOptical size={20} sx={{ m: 2 }} />}
          className="editor"
          {...props}
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("github-light", githubLightTheme as any);
            monaco.editor.defineTheme("github-dark", githubDarkTheme as any);
          }}
          onMount={handleEditorMount}
          theme={`github-${theme.palette.mode}`}
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

        <FullScreenButton
          onClick={() => setFullScreen((f) => !f)}
          active={fullScreen}
          style={{ right: 32 }}
        />

        <ResizeBottomRight
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
    </TrapFocus>
  );
}
