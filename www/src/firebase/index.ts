import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import appConfig from "./config";

firebase.initializeApp(appConfig);

export const auth = firebase.auth();

export const db = firebase.firestore();
db.settings({ cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED });
db.enablePersistence({ synchronizeTabs: true });

export const bucket = firebase.storage();
export const functions = firebase.functions();

export const googleProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters(
  {
    prompt: "select_account",
  }
);

export const deleteField = firebase.firestore.FieldValue.delete;
