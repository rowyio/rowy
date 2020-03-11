import * as functions from "firebase-functions";
import { db } from "./config";
import * as admin from "firebase-admin";
import { sendEmail } from "@gourmetpro/firetable-functions/lib/utils/email";
import { hasAnyRole } from "@gourmetpro/firetable-functions/lib/utils/auth";

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

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

    const authorized = hasAnyRole(["ADMIN", "PROGRAM"], context);

    if (!context.auth || !authorized) {
      console.warn(`unauthorized user${context}`);
      return {
        success: false,
        message: "you don't have permissions to send this email",
      };
    }
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
        await sendEmail("p8K9z0CBhGlb3Vgzl02o", row);
        return {
          message: "Founder created!",
          cellValue: {
            redo: false,
            status: "Verified",
            undo: true,
            meta: { ranBy: context.auth.token.email },
          },
          completedAt: serverTimestamp(),
          success: true,
        };
    }
  }
);

const dissolveTeam = async (
  data: {
    ref: {
      id: string;
      path: string;
      parentId: string;
    };
    row: any;
    column: any;
    action: "run" | "redo" | "undo";
  },
  context: functions.https.CallableContext
) => {
  const authorized = hasAnyRole(["ADMIN", "PROGRAM"], context);

  if (!context.auth || !authorized) {
    console.warn(`unauthorized user${{ context }}`);
    return {
      success: false,
      message: "you don't have permissions to dissolve this team",
    };
  }

  await db
    .collection("myTeam")
    .doc(data.ref.id)
    .update({ isDissolved: true });

  return {
    message: "team dissolved",
    cellValue: {
      redo: false,
      status: `Dissolved`,
      completedAt: serverTimestamp(),
      meta: { ranBy: context.auth.token.email },
      undo: false,
    },
    success: true,
  };
};

export const DissolveTeam = functions.https.onCall(dissolveTeam);
