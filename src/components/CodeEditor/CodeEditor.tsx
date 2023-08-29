import { useState } from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { useTheme, Box, BoxProps, AppBar, Toolbar } from "@mui/material";
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
import { AutoTypings, LocalStorageCache } from "monaco-editor-auto-typings";

export interface ICodeEditorProps
  extends Partial<EditorProps>,
    Omit<IUseMonacoCustomizationsProps, "fullScreen"> {
  value: string;
  containerProps?: Partial<BoxProps>;
  fullScreenTitle?: React.ReactNode;

  onValidate?: EditorProps["onValidate"];
  onValidStatusUpdate?: (result: {
    isValid: boolean;
    markers: editor.IMarker[];
  }) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function CodeEditor({
  value,
  minHeight = 100,
  disabled,
  error,
  containerProps,
  fullScreenTitle,

  onValidate,
  onValidStatusUpdate,
  onFocus,
  onBlur,

  extraLibs,
  diagnosticsOptions,
  onUnmount,
  defaultLanguage = "typescript",
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

  const validate = (monaco: Monaco, model: editor.ITextModel) => {
    const markers = [];
    for (let i = 1; i < model.getLineCount() + 1; i++) {
      const range = {
        startLineNumber: i,
        startColumn: 1,
        endLineNumber: i,
        endColumn: model.getLineLength(i) + 1,
      };
      const line = model.getValueInRange(range);
      for (const keyword of ["console.log", "console.warn", "console.error"]) {
        const consoleLogIndex = line.indexOf(keyword);
        if (consoleLogIndex >= 0) {
          markers.push({
            message: `Replace with ${keyword.replace(
              "console",
              "logging"
            )}: Rowy Cloud Logging provides a better experience to view logs. Simply replace 'console' with 'logging'. \n\nhttps://docs.rowy.io/cloud-logs`,
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: range.startLineNumber,
            endLineNumber: range.endLineNumber,
            startColumn: consoleLogIndex + 1,
            endColumn: consoleLogIndex + keyword.length + 1,
          });
        }
      }
    }
    monaco.editor.setModelMarkers(model, "owner", markers);
  };

  return (
    <TrapFocus open={fullScreen}>
      <Box
        component="div"
        sx={[boxSx, ...spreadSx(containerProps?.sx)]}
        style={fullScreen ? { height: "100%" } : {}}
      >
        {fullScreen && fullScreenTitle && (
          <AppBar position="static" color="inherit">
            <Toolbar variant="dense" sx={{ gap: 2 }}>
              {fullScreenTitle}
            </Toolbar>
          </AppBar>
        )}
        <Editor
          defaultLanguage={defaultLanguage}
          value={initialEditorValue}
          loading={<CircularProgressOptical size={20} sx={{ m: 2 }} />}
          className="editor"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("github-light", githubLightTheme as any);
            monaco.editor.defineTheme("github-dark", githubDarkTheme as any);
            monaco.editor.onDidCreateModel((model) => {
              validate(monaco, model);
              model.onDidChangeContent(() => {
                validate(monaco, model);
              });
            });
          }}
          {...props}
          onMount={async (editor, monaco) => {
            if (props.onMount) {
              props.onMount(editor, monaco);
            }
            if (onFocus) editor.onDidFocusEditorWidget(onFocus);
            if (onBlur) editor.onDidBlurEditorWidget(onBlur);
            const autoTypings = await AutoTypings.create(editor, {
              monaco: monaco,
              sourceCache: new LocalStorageCache(),
              debounceDuration: 500, // ms
              onError: (e) => {
                console.log("Auto typing error", e);
              },
            });
          }}
          onValidate={onValidate_}
          theme={`github-${theme.palette.mode}`}
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
            language: "typescript",
          }}
        />

        <FullScreenButton
          onClick={() => setFullScreen((f) => !f)}
          active={fullScreen}
        />

        {!fullScreen && (
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
        )}
      </Box>
    </TrapFocus>
  );
}
