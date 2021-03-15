// Initialize Firebase Admin
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

const settings = { timestampsInSnapshots: true };
db.settings(settings);

export { db, admin, auth };
