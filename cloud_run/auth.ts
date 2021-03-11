import * as admin from "firebase-admin";
// Initialize Firebase Admin
//const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

admin.initializeApp();
// const serviceAccount = require("./antler-develop-firebase.json");
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const auth = admin.auth();

export { db, admin, auth };
