import * as functions from "firebase-functions";
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
export const users = functions.firestore
  .document("users/{id}")
  .onUpdate(async(change, context) => {
    const afterData = change.after.data();

   if(afterData&&afterData.founder[0].docPath)await db.doc(afterData.founder[0].docPath).set({firstName:afterData.firstName,lastName:afterData.lastName,preferredName:afterData.preferredName,background:afterData.personalBio},{merge:true})

    return true;
  });
