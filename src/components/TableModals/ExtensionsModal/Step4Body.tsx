import { lazy, Suspense } from "react";
import { IExtensionModalStepProps } from "./ExtensionModal";
import { upperFirst } from "lodash-es";
import useStateRef from "react-usestateref";

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

export default function Step4Body({
  extensionObject,
  setExtensionObject,
  setValidation,
  validationRef,
}: IExtensionModalStepProps) {
  const [, setBodyEditorActive, bodyEditorActiveRef] = useStateRef(false);

  return (
    <>
      <Suspense fallback={<FieldSkeleton height={200} />}>
        <CodeEditor
          value={extensionObject.extensionBody}
          minHeight={400}
          onChange={(newValue) => {
            setExtensionObject({
              ...extensionObject,
              extensionBody: newValue || "",
            });
          }}
          onValidStatusUpdate={({ isValid }) => {
            if (!bodyEditorActiveRef.current) return;
            setValidation({
              ...validationRef.current!,
              extensionBody: isValid,
            });
          }}
          diagnosticsOptions={diagnosticsOptions}
          onMount={() => setBodyEditorActive(true)}
          onUnmount={() => setBodyEditorActive(false)}
        />
      </Suspense>

      <CodeEditorHelper
        docLink={
          WIKI_LINKS[
            `extensions${upperFirst(extensionObject.type)}` as "extensions"
          ] || WIKI_LINKS.extensions
        }
        additionalVariables={additionalVariables}
      />
    </>
  );
}
