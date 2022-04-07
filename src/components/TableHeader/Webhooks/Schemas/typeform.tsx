import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

export const webhookTypeform = {
  name: "Typeform",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table
    ) => `const typeformParser: Parser = async({req, db,ref}) =>{
      // this reduces the form submission into a single object of key value pairs
      // eg: {name: "John", age: 20}
      // ⚠️ ensure that you have assigned ref values of the fields
      // set the ref value to field key you would like to sync to
      // docs: https://help.typeform.com/hc/en-us/articles/360050447552-Block-reference-format-restrictions
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
        ? `
    // auditField
    const ${
      table.auditFieldCreatedBy ?? "_createdBy"
    } = await rowy.metadata.serviceAccountUser()
    return {
      ...submission,
      ${table.auditFieldCreatedBy ?? "_createdBy"}
    }
    `
        : `
    return submission
    `
    }
  };`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: (table) => `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
  },
  auth: (webhookObject, setWebhookObject) => {
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
