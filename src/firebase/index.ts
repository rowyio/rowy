import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import appConfig from "./config";

firebase.initializeApp(appConfig);

// Connect emulators based on env vars
const envConnectEmulators =
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_FIREBASE_EMULATOR === "true";

export const auth = firebase.auth();
if (envConnectEmulators && !(window as any).firebaseAuthEmulatorStarted) {
  auth.useEmulator("http://localhost:9099");
  (window as any).firebaseAuthEmulatorStarted = true;
}

export const db = firebase.firestore();
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true,
});
if (!(window as any).firebaseDbStarted) {
  if (envConnectEmulators) db.useEmulator("localhost", 9299);
  else db.enablePersistence({ synchronizeTabs: true });
  (window as any).firebaseDbStarted = true;
}

export const bucket = firebase.storage();
export const functions = firebase.functions();

export const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID!;

export const googleProvider =
  new firebase.auth.GoogleAuthProvider().setCustomParameters({
    prompt: "select_account",
  });

export const deleteField = firebase.firestore.FieldValue.delete;
