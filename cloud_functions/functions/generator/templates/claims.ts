/* tslint-disable */
import * as functions from "firebase-functions";
import { auth} from "./config";

export const <<COLLECTION_PATH>> = functions.firestore
  .document("<<COLLECTION_PATH>>/{id}")
  .onUpdate(async(change, context) => {
    const afterData = change.after.data();
    const beforeData = change.before.data();
    if (afterData) { 
      if( afterData.<<KEY_PATH>> !== before.<<KEY_PATH>> ){
     
        const customClaims = {
          /*<GENERATED_Claims>*/
        };
    
        await auth.setCustomUserClaims(context.params.id, customClaims);
    
      }
  } 
    return true;
  });
