// Initialize Firebase Admin
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// Initialize Cloud Firestore Database
export const db = admin.firestore();
// Initialize Auth
export const auth = admin.auth();

// Initialize Storage
export const storage = admin.storage();

const settings = {
  timestampsInSnapshots: true,
  ignoreUndefinedProperties: true,
};
db.settings(settings);
export const env = functions.config();
