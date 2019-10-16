import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_PROJECT_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_NAME}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_NAME}.firebaseio.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_NAME,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_NAME}.appspot.com`,
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const bucket = firebase.storage();
export const functions = firebase.functions();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
