// Initialize Firebase Admin
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

db.settings({ timestampsInSnapshots: true, ignoreUndefinedProperties: true });

export { db, admin, auth };
