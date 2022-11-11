import { lazy, Suspense } from "react";
import { IExtensionModalStepProps } from "./ExtensionModal";
import useStateRef from "react-usestateref";

import { Typography } from "@mui/material";
import FieldSkeleton from "@src/components/SideDrawer/FieldSkeleton";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import { WIKI_LINKS } from "@src/constants/externalLinks";

const CodeEditor = lazy(
  () =>
    import("@src/components/CodeEditor" /* webpackChunkName: "CodeEditor" */)
);

const additionalVariables = [
  {
    key: "row",
    description: `row has the value of doc.data() it has type definitions using this table's schema, but you can access any field in the document.`,
  },
  {
    key: "ref",
    description: `reference object that represents the reference to the current row in firestore db (ie: doc.ref).`,
  },
  {
    key: "change",
    description:
      "you can pass in field name to change.before.get() or change.after.get() to get changes",
  },
  {
    key: "triggerType",
    description: "triggerType indicates the type of the extension invocation",
  },
  {
    key: "fieldTypes",
    description:
      "fieldTypes is a map of all fields and its corresponding field type",
  },
  {
    key: "extensionConfig",
    description: "the configuration object of this extension",
  },
];

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

export default function Step3Conditions({
  extensionObject,
  setExtensionObject,
  setValidation,
  validationRef,
}: IExtensionModalStepProps) {
  const [, setConditionEditorActive, conditionEditorActiveRef] =
    useStateRef(false);

  return (
    <>
      <Typography gutterBottom>
        Optionally, write a function that determines if the extension should be
        triggered for a given row. Leave the function to always return{" "}
        <code>true</code> if you do not want to write additional logic.
      </Typography>

      <Suspense fallback={<FieldSkeleton height={200} />}>
        <CodeEditor
          value={extensionObject.conditions}
          minHeight={200}
          onChange={(newValue) => {
            setExtensionObject({
              ...extensionObject,
              conditions: newValue || "",
            });
          }}
          onValidStatusUpdate={({ isValid }) => {
            if (!conditionEditorActiveRef.current) return;
            setValidation({ ...validationRef.current!, condition: isValid });
          }}
          diagnosticsOptions={diagnosticsOptions}
          onMount={() => setConditionEditorActive(true)}
          onUnmount={() => setConditionEditorActive(false)}
        />
      </Suspense>

      <CodeEditorHelper
        docLink={WIKI_LINKS.extensions}
        additionalVariables={additionalVariables}
      />
    </>
  );
}
