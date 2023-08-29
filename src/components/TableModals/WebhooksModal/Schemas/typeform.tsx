import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

export const webhookTypeform = {
  name: "Typeform",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const typeformParser: Parser = async({req, db, ref, logging}) =>{
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("typeformParser started")
  
  // Import NPM package needed, some packages may not work in Webhooks
  // const {default: lodash} = await import("lodash");
  
  // This reduces the form submission into a single object of key value pairs
  // Example: {name: "John", age: 20}
  // ⚠️ Ensure that you have assigned ref values of the fields
  // Set the ref value to field key you would like to sync to
  // Docs: https://help.typeform.com/hc/en-us/articles/360050447552-Block-reference-format-restrictions
  const {submitted_at,hidden,answers} = req.body.form_response
  const submission  = ({
    _createdAt: submitted_at,
    ...hidden,
    ...answers.reduce((accRow, currAnswer) => {
      switch (currAnswer.type) {
        case "date":
          return {
            ...accRow,
            [currAnswer.field.ref]: new Date(currAnswer[currAnswer.type]),
          };
        case "choice":
          return {
            ...accRow,
            [currAnswer.field.ref]: currAnswer[currAnswer.type].label,
          };
        case "choices":
          return {
            ...accRow,
            [currAnswer.field.ref]: currAnswer[currAnswer.type].labels,
          };
        case "file_url":
        default:
          return {
            ...accRow,
            [currAnswer.field.ref]: currAnswer[currAnswer.type],
          };
      }
    }, {}),
  })
  
  ${
    table.audit !== false
      ? `const ${
          table.auditFieldCreatedBy ?? "_createdBy"
        } = await rowy.metadata.serviceAccountUser()
  return {
    ...submission,
    ${table.auditFieldCreatedBy ?? "_createdBy"}
  }`
      : `return submission;`
  }
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
};`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const condition: Condition = async({ref, req, db, logging}) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("condition started")
  
  return true;
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  Auth: (webhookObject: IWebhook, setWebhookObject: (w: IWebhook) => void) => {
    return (
      <>
        <Typography gutterBottom>
          Add a secret to your Typeform webhook config by following{" "}
          <Link
            href="https://developers.typeform.com/webhooks/secure-your-webhooks/"
            target="_blank"
            rel="noopener noreferrer"
            variant="inherit"
          >
            these instructions
            <InlineOpenInNewIcon />
          </Link>
          <br />
          Then add the secret below.
        </Typography>

        <TextField
          id="typeform-secret"
          label="Typeform secret"
          fullWidth
          value={webhookObject.auth.secret}
          onChange={(e) => {
            setWebhookObject({
              ...webhookObject,
              auth: { ...webhookObject.auth, secret: e.target.value },
            });
          }}
        />
      </>
    );
  },
};

export default webhookTypeform;
