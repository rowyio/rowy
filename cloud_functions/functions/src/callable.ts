import * as functions from "firebase-functions";
import { db } from "./config";
// example callable function
export const verifyFounder = functions.https.onCall(
  async (
    data: {
      ref: {
        id: string;
        path: string;
        parentId: string;
      };
      row: any;
      action: "run" | "redo" | "undo";
    },
    context: functions.https.CallableContext
  ) => {
    const { row, ref, action } = data;
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

    if (context.auth && context.auth.token.email.includes("@antler.co")) {
      switch (action) {
        case "undo":
        case "redo":
        case "run":
        default:
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
            cellValue: { redo: false, status: "Verified", undo: true },
            success: true,
          };
      }
    } else {
      return {
        message: "unauthorized function",
        // cellValue: { redo: false, status: "complete" },
        success: false,
      };
    }
  }
);
