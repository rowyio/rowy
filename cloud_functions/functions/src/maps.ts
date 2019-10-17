import * as functions from "firebase-functions";
export const users = functions.firestore
  .document("users/{id}")
  .onUpdate((change, context) => {
    console.log(change, context.eventType);
    return true;
  });
