import * as functions from "firebase-functions";
import { auth } from "./config";

export const users = functions.firestore
  .document("users/{id}")
  .onUpdate(async (change, context) => {
    const afterData = change.after.data();
    const beforeData = change.before.data();
    if (afterData && beforeData && afterData.startup && afterData.startup[0]) {
      if (afterData.startup !== beforeData.startup) {
        const customClaims = {
          portfolio: afterData.startup.map(
            (data: any) => data.snapshot.objectID
          ),
        };
        await auth.setCustomUserClaims(context.params.id, customClaims);
      }
    }
    return true;
  });
