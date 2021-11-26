import { IWebhookModalStepProps } from "./WebhookModal";
import useStateRef from "react-usestateref";

import { Typography } from "@mui/material";
import CodeEditor from "@src/components/CodeEditor";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { webhookSchemas } from "./utils";

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

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
      <Typography gutterBottom>
        Optionally, write a function that determines if the webhook call should
        be processed. Leave the function to always return <code>true</code> if
        you do not want to write additional logic.
      </Typography>

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
          diagnosticsOptions={diagnosticsOptions}
          onMount={() => setConditionEditorActive(true)}
          onUnmount={() => setConditionEditorActive(false)}
          extraLibs={
            webhookSchemas[webhookObject.type]?.condition?.extraLibs ??
            webhookSchemas["basic"].condition.extraLibs
          }
        />
      </div>

      <CodeEditorHelper
        docLink={WIKI_LINKS.webhooks}
        additionalVariables={
          webhookSchemas[webhookObject.type].condition?.additionalVariables ??
          webhookSchemas["basic"].condition.additionalVariables
        }
      />
    </>
  );
}
