import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
export const <<COLLECTION_PATH>> = functions.firestore
  .document("<<COLLECTION_PATH>>/{id}")
  .<<TRIGGER_EVENT>>((change, context) => {
    const afterData = change.after.data();

   /*<GENERATED_CODE>*/

    return true;
  });
