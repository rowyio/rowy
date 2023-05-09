import { Typography, Link, TextField } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";
import { TableSettings } from "@src/types/table";
import { IWebhook } from "@src/components/TableModals/WebhooksModal/utils";

export const webhookFirebaseAuth = {
  name: "firebaseAuth",
  parser: {
    additionalVariables: null,
    extraLibs: null,
    template: (
      table: TableSettings
    ) => `const firebaseAuthParser: Parser = async({req, db, ref, logging}) =>{
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("firebaseAuthParser started")
  /**
   * This is a sample parser for firebase authentication
   * creates a user document in the collection if it doesn't exist
  // check if document exists,
  const userDoc = await ref.doc(user.uid).get()
  if(!userDoc.exists){
    await ref.doc(user.uid).set({email:user.email})
  }
  */
 return;
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
        <Typography variant="inherit" paragraph>
          For Firebase authentication, you need to include the following header
          in your request:
          <br />
          <code>Authorization: Bear ACCESS_TOKEN</code>
        </Typography>

        <Typography variant="inherit" paragraph>
          Once enabled requests without a valid token will return{" "}
          <code>401</code> response.
        </Typography>
      </>
    );
  },
};

export default webhookFirebaseAuth;
