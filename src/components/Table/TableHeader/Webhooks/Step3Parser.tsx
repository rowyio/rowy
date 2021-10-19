import { IWebhookModalStepProps } from "./WebhookModal";
import _upperFirst from "lodash/upperFirst";
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

export default function Step4Body({
  webhookObject,
  setWebhookObject,
  setValidation,
  validationRef,
}: IWebhookModalStepProps) {
  const [, setBodyEditorActive, bodyEditorActiveRef] = useStateRef(false);

  return (
    <>
      <div>
        <CodeEditor
          script={webhookObject.parser}
          height={400}
          handleChange={(newValue) => {
            setWebhookObject({
              ...webhookObject,
              parser: newValue,
            });
          }}
          onValidStatusUpdate={({ isValid }) => {
            if (!bodyEditorActiveRef.current) return;
            setValidation({
              ...validationRef.current!,
              parser: isValid,
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
          WIKI_LINKS[`webhooks${_upperFirst(webhookObject.type)}`] ||
          WIKI_LINKS.webhooks
        }
        additionalVariables={additionalVariables}
      />
    </>
  );
}
