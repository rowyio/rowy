import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
export const users = functions.firestore
  .document("users/{id}")
  .onUpdate((change, context) => {
    const afterData = change.after.data();

   if(afterData&&afterData.founderId)db.collection("founders").doc(afterData.founderId).set({firstName:afterData.firstName,lastName:afterData.lastName,preferredName:afterData.preferredName})

    return true;
  });
