import { IWebhookModalStepProps } from "./WebhookModal";
import useStateRef from "react-usestateref";

import CodeEditor from "components/Table/editors/CodeEditor";
import CodeEditorHelper from "components/CodeEditorHelper";

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
          script={webhookObject.conditions}
          height={200}
          handleChange={(newValue) => {
            setWebhookObject({
              ...webhookObject,
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
        docLink={WIKI_LINKS.webhooks}
        additionalVariables={additionalVariables}
      />
    </>
  );
}
