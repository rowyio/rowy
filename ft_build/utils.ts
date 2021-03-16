import { db } from "./firebaseConfig";
const admin = require("firebase-admin");

export function commandErrorHandler(meta: {
  uid?: string;
  email?: string;
  description?: string;
  combiledScript?: string;
  sparksConfig?: string;
}) {
  return function (error, stdout, stderr) {
    if (!error) {
      return;
    }

    const errorRecord = {
      errorType: "commandError",
      ranByUID: meta?.uid ?? "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stdout: stdout ?? "",
      stderr: stderr ?? "",
      errorStackTrace: error?.stack ?? "",
      command: error?.cmd ?? "",
      description: meta?.description ?? "",
      combiledScript: meta?.combiledScript ?? "",
      sparksConfig: meta?.sparksConfig ?? "",
    };

    db.collection("_FT_ERRORS").add(errorRecord);
  };
}

export function logErrorToDB(data: {
  errorDescription: string;
  errorExtraInfo?: string;
  errorTraceStack?: string;
  uid?: string;
  email?: string;
  sparksConfig?: string;
}) {
  console.log(data.errorDescription);
  db.collection("_FT_ERRORS").add({
    errorType: "codeError",
    ranByUID: data?.uid ?? "",
    email: data?.email ?? "",
    description: data.errorDescription,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    sparksConfig: data?.sparksConfig ?? "",
    errorExtraInfo: data?.errorExtraInfo ?? "",
    errorStackTrace: data?.errorTraceStack ?? "",
  });
}

export function validateSparks(
  sparks: string,
  auth: {
    uid?: string;
    email?: string;
  }
) {
  let parsedSparks;

  // try to parse sparks
  try {
    parsedSparks = eval(sparks);
  } catch (e) {
    logErrorToDB({
      errorDescription: "Invalid sparks config",
      errorExtraInfo: e?.message,
      errorTraceStack: e?.stack,
      sparksConfig: sparks,
      ...auth,
    });
    return false;
  }

  //TODO define rules to validate sparks

  return true;
}
