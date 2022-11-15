import { IWebhookModalStepProps } from "./WebhookModal";
import { upperFirst } from "lodash-es";
import useStateRef from "react-usestateref";

import { Typography, Link } from "@mui/material";
import CodeEditor from "@src/components/CodeEditor";
import CodeEditorHelper from "@src/components/CodeEditor/CodeEditorHelper";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

import { WIKI_LINKS } from "@src/constants/externalLinks";
import { parserExtraLibs } from "./utils";

const additionalVariables = [
  {
    key: "ref",
    description: `reference object that represents the reference to the current collection in firestore db.`,
  },
  {
    key: "req",
    description: "webhook request",
  },
];

const diagnosticsOptions = {
  noSemanticValidation: false,
  noSyntaxValidation: false,
  noSuggestionDiagnostics: true,
};

export default function Step4Body({
  webhookObject,
  setWebhookObject,
  setValidation,
  validationRef,
}: IWebhookModalStepProps) {
  const [, setBodyEditorActive, bodyEditorActiveRef] = useStateRef(false);

  return (
    <>
      <Typography gutterBottom>
        Write a function to parse webhook requests. Return an object, which will
        be added as a new row.{" "}
        <Link
          href={
            WIKI_LINKS[
              `webhooks${upperFirst(webhookObject.type)}` as "webhooks"
            ] || WIKI_LINKS.webhooks
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
          <InlineOpenInNewIcon />
        </Link>
      </Typography>

      <div>
        <CodeEditor
          value={webhookObject.parser}
          minHeight={400}
          onChange={(newValue) => {
            setWebhookObject({
              ...webhookObject,
              parser: newValue || "",
            });
          }}
          onValidStatusUpdate={({ isValid }) => {
            if (!bodyEditorActiveRef.current) return;
            setValidation({
              ...validationRef.current!,
              parser: isValid,
            });
          }}
          diagnosticsOptions={diagnosticsOptions}
          onMount={() => setBodyEditorActive(true)}
          onUnmount={() => setBodyEditorActive(false)}
          extraLibs={parserExtraLibs}
        />
      </div>

      <CodeEditorHelper
        docLink={
          WIKI_LINKS[
            `webhooks${upperFirst(webhookObject.type)}` as "webhooks"
          ] || WIKI_LINKS.webhooks
        }
        additionalVariables={additionalVariables}
      />
    </>
  );
}
