import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

import { productionConfig, stagingConfig } from "./config";

if (process.env.REACT_APP_ENV === "PRODUCTION") {
  console.log("production");
  firebase.initializeApp(productionConfig);
} else {
  console.log("staging");
  firebase.initializeApp(stagingConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const bucket = firebase.storage();
export const functions = firebase.functions();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
