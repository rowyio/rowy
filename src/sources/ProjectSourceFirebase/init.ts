import { atom } from "jotai";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

export const envConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_PROJECT_WEB_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
};

// Connect emulators based on env vars
const envConnectEmulators =
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_FIREBASE_EMULATORS === "true";

/**
 * Store Firebase config here so it can be set programmatically.
 * This lets us switch between Firebase projects.
 * Root atom from which app, auth, db, storage are derived.
 */
export const firebaseConfigAtom = atom<FirebaseOptions>(envConfig);

/** Store Firebase app instance */
export const firebaseAppAtom = atom((get) => {
  const firebaseConfig = get(firebaseConfigAtom);
  return initializeApp(firebaseConfig, firebaseConfig.projectId);
});

/**
 * Store Firebase Auth instance for current app.
 * Connects to emulators based on env vars.
 */
export const firebaseAuthAtom = atom((get) => {
  const auth = getAuth(get(firebaseAppAtom));
  if (envConnectEmulators && !(window as any).firebaseAuthEmulatorStarted) {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    (window as any).firebaseAuthEmulatorStarted = true;
  }
  return auth;
});

/**
 * Store Firestore instance for current app.
 * Connects to emulators based on env vars, or enables multi-tab indexed db persistence.
 */
export const firebaseDbAtom = atom((get) => {
  const db = initializeFirestore(get(firebaseAppAtom), {
    ignoreUndefinedProperties: true,
  });
  if (!(window as any).firebaseDbStarted) {
    if (envConnectEmulators) connectFirestoreEmulator(db, "localhost", 9299);
    else enableMultiTabIndexedDbPersistence(db);
    (window as any).firebaseDbStarted = true;
  }
  return db;
});
