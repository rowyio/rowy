import { useEffect } from "react";
import { atom, useAtom } from "jotai";

import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, getIdTokenResult } from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

import { currentUserAtom, userRolesAtom } from "@src/atoms/auth";

import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import { globalScope } from "@src/atoms/globalScope";
import { projectIdAtom, publicSettingsAtom } from "@src/atoms/project";
import { useUpdateAtom } from "jotai/utils";
import { userSettingsAtom, UserSettings } from "@src/atoms/user";

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
  process.env.REACT_APP_FIREBASE_EMULATOR === "true";

// Store Firebase config here so it can be set programmatically.
// This lets us switch between Firebase projects.
// Then app, auth, db, storage need to be derived atoms.
export const firebaseConfigAtom = atom<FirebaseOptions>(envConfig);

export const firebaseAppAtom = atom((get) =>
  initializeApp(get(firebaseConfigAtom))
);

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

export const firebaseDbAtom = atom((get) => {
  const db = initializeFirestore(get(firebaseAppAtom), {
    ignoreUndefinedProperties: true,
  });
  if (!(window as any).firebaseDbStarted) {
    if (envConnectEmulators) connectFirestoreEmulator(db, "localhost", 8080);
    else enableMultiTabIndexedDbPersistence(db);
    (window as any).firebaseDbStarted = true;
  }
  return db;
});

export default function ProjectSourceFirebase() {
  // Set projectId from Firebase project
  const [firebaseConfig] = useAtom(firebaseConfigAtom, globalScope);
  const setProjectId = useUpdateAtom(projectIdAtom, globalScope);
  useEffect(() => {
    setProjectId(firebaseConfig.projectId || "");
  }, [firebaseConfig.projectId, setProjectId]);

  // Get current user and store in atoms
  const [firebaseAuth] = useAtom(firebaseAuthAtom, globalScope);
  // const setCurrentUser: any = useUpdateAtom(currentUserAtom, globalScope);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom, globalScope);
  const setUserRoles = useUpdateAtom(userRolesAtom, globalScope);

  useEffect(() => {
    // Suspend when currentUser has not been read yet
    (setCurrentUser as any)(new Promise(() => {}));

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        const tokenResult = await getIdTokenResult(user);
        setUserRoles((tokenResult.claims.roles as string[]) ?? []);
      } else {
        setUserRoles([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [firebaseAuth, setCurrentUser, setUserRoles]);

  // Store public settings in atom
  useFirestoreDocWithAtom(
    publicSettingsAtom,
    globalScope,
    "_rowy_/publicSettings"
  );

  // Store user settings in atom when a user is signed in
  useFirestoreDocWithAtom(
    userSettingsAtom,
    globalScope,
    `_rowy_/userManagement/users`,
    { pathSegments: [currentUser?.uid] }
  );

  return null;
}
