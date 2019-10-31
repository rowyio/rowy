/* tslint-disable */
import * as functions from "firebase-functions";
import { db} from "./config";

export const users = functions.firestore
  .document("users/{id}")
  .onUpdate(async(change, context) => {
    const afterData = change.after.data();
    if (afterData) { 
      if( afterData.founder[0].docPath){
        const updates = {firstName:afterData.firstName,lastName:afterData.lastName,preferredName:afterData.preferredName,background:afterData.personalBio,role:afterData.role,profilePhoto:afterData.profilePhoto}
        console.log(`updates FROM users/${context.params.id} TO ${afterData.founder[0].docPath}`, updates)
   await db.doc(afterData.founder[0].docPath).set(updates, { merge: true }); 
      }
   

  }
 
    return true;
  });
