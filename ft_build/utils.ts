import { db } from "./firebaseConfig";
const admin = require("firebase-admin");

export function commandErrorHandler(error, stdout, stderr, uid) {
  if (!error) {
    return;
  }

  const errorRecord = {
    errorType: "commandError",
    ranByUID: uid ?? "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    stdout: stdout ?? "",
    stderr: stderr ?? "",
    errorStack: error?.stack ?? "",
    command: error?.cmd ?? "",
  };

  db.collection("_FT_ERRORS").add(errorRecord);
}

export function logErrorToDB(errorDescription, uid) {
  console.log(errorDescription);
  db.collection("_FT_ERRORS").add({
    errorType: "codeError",
    uid: uid ?? "",
    description: errorDescription,
  });
}
