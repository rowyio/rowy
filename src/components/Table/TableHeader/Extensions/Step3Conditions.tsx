import { IExtensionModalStepProps } from "./ExtensionModal";
import useStateRef from "react-usestateref";

import CodeEditor from "components/Table/editors/CodeEditor";
import CodeEditorHelper from "components/CodeEditorHelper";

import { WIKI_LINKS } from "constants/externalLinks";

const additionalVariables = [
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
      <div>
        <CodeEditor
          script={extensionObject.conditions}
          height={200}
          handleChange={(newValue) => {
            setExtensionObject({
              ...extensionObject,
              conditions: newValue,
            });
          }}
          onValidStatusUpdate={({ isValid }) => {
            if (!conditionEditorActiveRef.current) return;
            setValidation({ ...validationRef.current!, condition: isValid });
          }}
          diagnosticsOptions={{
            noSemanticValidation: false,
            noSyntaxValidation: false,
            noSuggestionDiagnostics: true,
          }}
          onMount={() => setConditionEditorActive(true)}
          onUnmount={() => setConditionEditorActive(false)}
        />
      </div>

      <CodeEditorHelper
        docLink={WIKI_LINKS.extensions}
        additionalVariables={additionalVariables}
      />
    </>
  );
}
