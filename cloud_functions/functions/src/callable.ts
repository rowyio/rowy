import * as functions from "firebase-functions";
import * as _ from "lodash";
import { db } from "./config";
import * as admin from "firebase-admin";
// example callable function

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
const emailGenerator = (
  emailTemplate: { subject: string; body: string },
  data: any
) => {
  const subject = emailTemplate.subject.replace(/\{\{(.*?)\}\}/g, function(
    m,
    key
  ) {
    return _.get(data, key, "");
  });

  const html = emailTemplate.body.replace(/\{\{(.*?)\}\}/g, function(m, key) {
    return _.get(data, key, "");
  });

  return { subject, html };
};

const sendVerifiedEmail = async (row: any) => {
  const emailTemplate = await db
    .doc("emailTemplates/p8K9z0CBhGlb3Vgzl02o")
    .get();
  const templateData = emailTemplate.data();
  if (!templateData || !templateData.subject || !templateData.body)
    return false;

  const message = emailGenerator(
    templateData as { subject: string; body: string },
    row
  );

  return db.collection("firemail").add({
    to: row.email,
    message,
    createdAt: serverTimestamp(),
  });
};

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
          await sendVerifiedEmail(row);
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
    } else {
      return {
        message: "unauthorized function",
        // cellValue: { redo: false, status: "complete" },
        success: false,
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
    action: "run" | "redo" | "undo";
  },
  context: functions.https.CallableContext
) => {
  if (context.auth && context.auth.token.email.includes("@antler.co")) {
    await db
      .collection("myTeam")
      .doc(data.ref.id)
      .update({ isDissolved: true });
    return {
      message: "Team dissemble",
      cellValue: {
        redo: false,
        status: `dissolved`,
        completedAt: serverTimestamp(),
        meta: { ranBy: context.auth.token.email },
        undo: true,
      },
      success: true,
    };
  } else {
    return {
      message: "unauthorized user",
      // cellValue: { redo: false, status: "complete" },
      success: false,
    };
  }
};

export const FH_dissolveTeam = functions.https.onCall(dissolveTeam);
