// Initialize Firebase Admin
const admin = require("firebase-admin");
admin.initializeApp();
// Initialize Cloud Firestore Database
 const db = admin.firestore();
// Initialize Auth
 const auth = admin.auth();
export { db, admin, auth };
const settings = { timestampsInSnapshots: true };
db.settings(settings);