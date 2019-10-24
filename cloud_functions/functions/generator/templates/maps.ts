import * as functions from "firebase-functions";
const admin = require("firebase-admin");
const db = admin.firestore();
export const <<COLLECTION_PATH>> = functions.firestore
  .document("<<COLLECTION_PATH>>/{id}")
  .<<TRIGGER_EVENT>>(async(change, context) => {
    const afterData = change.after.data();

   /*<GENERATED_CODE>*/

    return true;
  });
