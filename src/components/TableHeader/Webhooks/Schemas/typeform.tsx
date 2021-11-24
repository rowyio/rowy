import { Typography, Link, TextField } from "@mui/material";

export default {
  name: "Typeform",
  parser: {
    additionalVariables: null,
    extraLibs: null,

    template: `const typeformParser: Parser = async({req, db,ref}) =>{
      // this reduces the form submission into a single object of key value pairs
      // eg: {name: "John", age: 20}
      // ⚠️ ensure that you have assigned ref values of the fields
      // set the ref value to field key you would like to sync to
      // docs: https://help.typeform.com/hc/en-us/articles/360050447552-Block-reference-format-restrictions
      const {submitted_at,hidden,answers} = req.body.form_response
      return ({
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
    })};`,
  },
  condition: {
    additionalVariables: null,
    extraLibs: null,
    template: `const condition: Condition = async({ref,req,db}) => {
      // feel free to add your own code logic here
      return true;
    }`,
  },
  auth: (webhookObject, setWebhookObject) => {
    return (
      <>
        <Typography gutterBottom>
          To verify the webhook call is sent from typeform, you need to add
          secret on your webhook config on be follow the instructions{" "}
          <Link
            href={
              "https://developers.typeform.com/webhooks/secure-your-webhooks/"
            }
            rel="noopener noreferrer"
            variant="body2"
            underline="always"
          >
            here
          </Link>{" "}
          to set the secret, then add it below
        </Typography>

        <TextField
          label={"Typeform Secret"}
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
