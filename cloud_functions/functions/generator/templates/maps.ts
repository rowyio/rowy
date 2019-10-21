import * as functions from "firebase-functions";
export const <<COLLECTION_PATH>> = functions.firestore
  .document("<<COLLECTION_PATH>>/{id}")
  .<<TRIGGER_EVENT>>((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    let tasks = [];
    /*<GENERATED_CODE>*/
    console.log(tasks);
    return true;
  });
