import { db } from "./firebaseConfig";
const admin = require("firebase-admin");

export function commandErrorHandler(meta: {
  uid?: string;
  email?: string;
  description?: string;
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
      errorStack: error?.stack ?? "",
      command: error?.cmd ?? "",
      description: meta?.description ?? "",
    };

    db.collection("_FT_ERRORS").add(errorRecord);
  };
}

export function logErrorToDB(errorDescription, uid) {
  console.log(errorDescription);
  db.collection("_FT_ERRORS").add({
    errorType: "codeError",
    uid: uid ?? "",
    description: errorDescription,
  });
}
