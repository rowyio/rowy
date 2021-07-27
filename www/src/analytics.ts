import firebase from "firebase/app";
import "firebase/analytics";
var firebaseConfig = {
  apiKey: "AIzaSyBwgfb-GmsCZ_d4B5kRElzWMoPWwjdKioM",
  authDomain: "firetable-service.firebaseapp.com",
  projectId: "firetable-service",
  storageBucket: "firetable-service.appspot.com",
  messagingSenderId: "831080389",
  appId: "1:831080389:web:ab0bbacccdd887ab3b6dac",
  measurementId: "G-K97G7PBDNT",
};
// Initialize Firebase
const firetableServiceApp = firebase.initializeApp(
  firebaseConfig,
  "firetable-service"
);
export const analytics = firebase.analytics(firetableServiceApp);
