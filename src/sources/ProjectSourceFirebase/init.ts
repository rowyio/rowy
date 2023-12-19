import { atom } from "jotai";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions } from "firebase/functions";

export const envConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_PROJECT_WEB_API_KEY,
  authDomain: `${import.meta.env.VITE_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${
    import.meta.env.VITE_APP_FIREBASE_PROJECT_ID
  }.firebaseio.com`,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_APP_FIREBASE_PROJECT_ID}.appspot.com`,
};

// Connect emulators based on env vars
const envConnectEmulators =
  import.meta.env.NODE_ENV === "test" ||
  import.meta.env.VITE_APP_FIREBASE_EMULATORS === "true";

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
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  if (!(window as any).firebaseDbStarted) {
    if (envConnectEmulators) connectFirestoreEmulator(db, "localhost", 9299);
    (window as any).firebaseDbStarted = true;
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
    if (envConnectEmulators) connectStorageEmulator(storage, "localhost", 9199);
    (window as any).firebaseStorageEmulatorStarted = true;
  }
  return storage;
});

/**
 * Store Firebase Functions instance for current app.
 */
export const firebaseFunctionsAtom = atom((get) =>
  getFunctions(get(firebaseAppAtom))
);
