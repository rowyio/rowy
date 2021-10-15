import { IExtensionModalStepProps } from "./ExtensionModal";
import _upperFirst from "lodash/upperFirst";
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

export default function Step4Body({
  extensionObject,
  setExtensionObject,
  setValidation,
  validationRef,
}: IExtensionModalStepProps) {
  const [, setBodyEditorActive, bodyEditorActiveRef] = useStateRef(false);

  return (
    <>
      <div>
        <CodeEditor
          script={extensionObject.extensionBody}
          height={400}
          handleChange={(newValue) => {
            setExtensionObject({
              ...extensionObject,
              extensionBody: newValue,
            });
          }}
          onValidStatusUpdate={({ isValid }) => {
            if (!bodyEditorActiveRef.current) return;
            setValidation({
              ...validationRef.current!,
              extensionBody: isValid,
            });
          }}
          diagnosticsOptions={{
            noSemanticValidation: false,
            noSyntaxValidation: false,
            noSuggestionDiagnostics: true,
          }}
          onMount={() => setBodyEditorActive(true)}
          onUnmount={() => setBodyEditorActive(false)}
        />
      </div>

      <CodeEditorHelper
        docLink={
          WIKI_LINKS[`extensions${_upperFirst(extensionObject.type)}`] ||
          WIKI_LINKS.extensions
        }
        additionalVariables={additionalVariables}
      />
    </>
  );
}
