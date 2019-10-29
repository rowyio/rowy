/* tslint-disable */
import * as functions from "firebase-functions";
import { db} from "./config";

export const <<COLLECTION_PATH>> = functions.firestore
  .document("<<COLLECTION_PATH>>/{id}")
  .<<TRIGGER_EVENT>>(async(change, context) => {
    const afterData = change.after.data();
    if (afterData) { 
      if( afterData.<<TARGET_DOC_PATH>>){
        /*<GENERATED_CODE>*/
        console.log(`updates FROM <<COLLECTION_PATH>>/${context.params.id} TO ${afterData.<<TARGET_DOC_PATH>>}`, updates)
   await db.doc(afterData.founder[0].docPath).set(updates, { merge: true }); 
      }
   

  }
 
    return true;
  });
