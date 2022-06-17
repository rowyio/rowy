import { AutoTypings, LocalStorageCache } from "monaco-editor-auto-typings";
import Editor, { OnMount } from "@monaco-editor/react";

const defaultCode = `import React from "react";
function App() {
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}
`;
const handleEditorMount: OnMount = (monacoEditor, monaco) => {
  console.log("handleEditorMount");
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    typeRoots: ["node_modules/@types"],
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  const autoTypings = AutoTypings.create(monacoEditor, {
    sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
    monaco: monaco,
    onError: (error) => {
      console.log(error);
    },
    onUpdate: (update, textual) => {
      console.log(textual);
    },
  });
};
export default function Function() {
  const onChange = (value: string | undefined, ev: any) => {
    //console.log(value)
  };
  return (
    <Editor
      height="100vh"
      theme="vs-dark"
      defaultPath="app.tsx"
      defaultLanguage="typescript"
      defaultValue={defaultCode}
      onChange={onChange}
      onMount={handleEditorMount}
    />
  );
}
