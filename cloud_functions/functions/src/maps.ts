import * as functions from "firebase-functions";
export const users = functions.firestore
  .document("users/{id}")
  .<<TRIGGER_EVENT>>((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    let tasks = [];
    tasks.push({})
    console.log(tasks);
    return true;
  });
