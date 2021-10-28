import { IWebhookModalStepProps } from "./WebhookModal";
import useStateRef from "react-usestateref";

import CodeEditor from "components/CodeEditor";
import CodeEditorHelper from "components/CodeEditor/CodeEditorHelper";

import { WIKI_LINKS } from "constants/externalLinks";

const additionalVariables = [
  {
    key: "req",
    description: "webhook request",
  },
];

export default function Step3Conditions({
  webhookObject,
  setWebhookObject,
  setValidation,
  validationRef,
}: IWebhookModalStepProps) {
  const [, setConditionEditorActive, conditionEditorActiveRef] =
    useStateRef(false);

  return (
    <>
      <div>
        <CodeEditor
          value={webhookObject.conditions}
          minHeight={200}
          onChange={(newValue) => {
            setWebhookObject({
              ...webhookObject,
              conditions: newValue || "",
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
        docLink={WIKI_LINKS.webhooks}
        additionalVariables={additionalVariables}
      />
    </>
  );
}
