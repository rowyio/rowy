import * as functions from "firebase-functions";
import * as _ from "lodash";
import * as admin from "firebase-admin";
import { sendEmail } from "./utils/email";
import { hasAnyRole } from "./utils/auth";

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

const sendEmailTemplateCallable = async (
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
    console.warn(`unauthorized user${context}`);
    return {
      success: false,
      message: "you don't have permissions to send this email",
    };
  }
  console.log({ column: data.column });
  await sendEmail(data.column.config.templateId, data.row);

  return {
    message: "Email Sent",
    cellValue: {
      redo: true,
      status: `sent`,
      completedAt: serverTimestamp(),
      meta: { ranBy: context.auth.token.email },
      undo: false,
    },
    success: true,
  };
};

export const SendEmail = functions.https.onCall(sendEmailTemplateCallable);
