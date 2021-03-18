import { db } from "./firebaseConfig";
import admin from "firebase-admin";
const safeEval = require("safe-eval");

function firetableUser(user: admin.auth.UserRecord) {
  return {
    displayName: user?.displayName,
    email: user?.email,
    uid: user?.uid,
    emailVerified: user?.emailVerified,
    photoURL: user?.photoURL,
    timestamp: new Date(),
  };
}

async function insertErrorRecordToDB(errorRecord: object) {
  await db.collection("_FT_ERRORS").add(errorRecord);
}

function commandErrorHandler(meta: {
  user: admin.auth.UserRecord;
  description?: string;
  functionConfigTs?: string;
  sparksConfig?: string;
}) {
  return async function (error, stdout, stderr) {
    if (!error) {
      return;
    }

    const errorRecord = {
      errorType: "commandError",
      ranBy: firetableUser(meta.user),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stdout: stdout ?? "",
      stderr: stderr ?? "",
      errorStackTrace: error?.stack ?? "",
      command: error?.cmd ?? "",
      description: meta?.description ?? "",
      functionConfigTs: meta?.functionConfigTs ?? "",
      sparksConfig: meta?.sparksConfig ?? "",
    };
    insertErrorRecordToDB(errorRecord);
  };
}

async function logErrorToDB(data: {
  errorDescription: string;
  errorExtraInfo?: string;
  errorTraceStack?: string;
  user: admin.auth.UserRecord;
  sparksConfig?: string;
}) {
  console.error(data.errorDescription);

  const errorRecord = {
    errorType: "codeError",
    ranBy: firetableUser(data.user),
    description: data.errorDescription,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    sparksConfig: data?.sparksConfig ?? "",
    errorExtraInfo: data?.errorExtraInfo ?? "",
    errorStackTrace: data?.errorTraceStack ?? "",
  };

  insertErrorRecordToDB(errorRecord);
}

async function validateSparks(sparks: string, user: admin.auth.UserRecord) {
  let parsedSparks;

  try {
    parsedSparks = safeEval(sparks);
  } catch (e) {
    await logErrorToDB({
      errorDescription: "Invalid sparks config",
      errorExtraInfo: e?.message,
      errorTraceStack: e?.stack,
      sparksConfig: sparks,
      user,
    });
    return false;
  }

  //TODO define rules to validate sparks

  return true;
}

export { commandErrorHandler, logErrorToDB, validateSparks };
