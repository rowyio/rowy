import { db } from "./firebaseConfig";
import admin from "firebase-admin";

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

export function commandErrorHandler(meta: {
  user: admin.auth.UserRecord;
  description?: string;
  combiledScript?: string;
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
      combiledScript: meta?.combiledScript ?? "",
      sparksConfig: meta?.sparksConfig ?? "",
    };

    await db.collection("_FT_ERRORS").add(errorRecord);
  };
}

export async function logErrorToDB(data: {
  errorDescription: string;
  errorExtraInfo?: string;
  errorTraceStack?: string;
  user: admin.auth.UserRecord;
  sparksConfig?: string;
}) {
  console.log(data.errorDescription);
  await db.collection("_FT_ERRORS").add({
    errorType: "codeError",
    ranBy: firetableUser(data.user),
    description: data.errorDescription,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    sparksConfig: data?.sparksConfig ?? "",
    errorExtraInfo: data?.errorExtraInfo ?? "",
    errorStackTrace: data?.errorTraceStack ?? "",
  });
}

export async function validateSparks(
  sparks: string,
  user: admin.auth.UserRecord
) {
  let parsedSparks;

  // try to parse sparks
  try {
    parsedSparks = eval(sparks);
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
