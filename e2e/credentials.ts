// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
const serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});
export const db = admin.firestore();
export const auth = admin.auth();
