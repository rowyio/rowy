import { atom } from "jotai";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import {
  REACT_APP_FIREBASE_EMULATORS,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_PROJECT_WEB_API_KEY,
} from "@src/constants/env";

export const envConfig = {
  apiKey: REACT_APP_FIREBASE_PROJECT_WEB_API_KEY,
  authDomain: `${REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
};
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
  if (
    REACT_APP_FIREBASE_EMULATORS &&
    !(window as any).firebaseAuthEmulatorStarted
  ) {
    connectAuthEmulator(auth, "http://localhost:9099", {
      disableWarnings: true,
    });
    (window as any).firebaseAuthEmulatorStarted = true;
  } else {
    (window as any).firebaseAuthStarted = true;
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
    if (REACT_APP_FIREBASE_EMULATORS) {
      connectFirestoreEmulator(db, "localhost", 9299);
      (window as any).firebaseDbEmulatorsStarted = true;
    } else {
      enableMultiTabIndexedDbPersistence(db);
      (window as any).firebaseDbStarted = true;
    }
  }
  return db;
});

/**
 * Store Firebase Storage instance for current app.
 * Connects to emulators based on env vars.
 */
export const firebaseStorageAtom = atom((get) => {
  const storage = getStorage(get(firebaseAppAtom));
  if (!(window as any).firebaseStorageEmulatorStarted) {
    if (REACT_APP_FIREBASE_EMULATORS) {
      connectStorageEmulator(storage, "localhost", 9199);
      (window as any).firebaseStorageEmulatorStarted = true;
    } else {
      (window as any).firebaseStorageStarted = true;
    }
  }
  return storage;
});

/**
 * Store Firebase Functions instance for current app.
 */
export const firebaseFunctionsAtom = atom((get) =>
  getFunctions(get(firebaseAppAtom))
);
