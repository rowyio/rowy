import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import appConfig from "./config";

firebase.initializeApp(appConfig);

export const auth = firebase.auth();

export const db = firebase.firestore();
db.settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true,
});
db.enablePersistence({ synchronizeTabs: true });

export const bucket = firebase.storage();
export const functions = firebase.functions();

export const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
export const WEBHOOK_URL = `https://${(functions as any).region_}-${
  appConfig.projectId
}.cloudfunctions.net/webhook`;
export const googleProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters(
  {
    prompt: "select_account",
  }
);

export const deleteField = firebase.firestore.FieldValue.delete;
