import * as functions from "firebase-functions";
import { db } from "./config";
// example callable function
export const createInFounders = functions.https.onCall(
  async (
    data: {
      ref: {
        id: string;
        path: string;
        parentId: string;
      };
      row: any;
    },
    context: functions.https.CallableContext
  ) => {
    const { row, ref } = data;
    console.log(context.auth);

    if (context.auth && context.auth.token.email.includes("@antler.co")) {
      const fieldsToSync = [
        "firstName",
        "lastName",
        "preferredName",
        "personalBio",
        "founderType",
        "cohort",
        "email",
        "profilePhoto",
        "twitter",
        "employerLogos",
        "linkedin",
        "publicProfile",
        "companies",
      ];
      const syncData = fieldsToSync.reduce((acc: any, curr: string) => {
        if (row[curr]) {
          acc[curr] = row[curr];
          return acc;
        } else return acc;
      }, {});
      await db
        .collection("founders")
        .doc(ref.id)
        .set(syncData, { merge: true });
      return {
        message: "Founder created!",
        cellValue: { redo: false, status: "complete" },
        success: true,
      };
    } else {
      return {
        message: "unauthorized function",
        cellValue: { redo: false, status: "complete" },
        success: false,
      };
    }
  }
);
