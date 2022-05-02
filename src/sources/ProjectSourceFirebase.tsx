import { memo, useEffect, useCallback } from "react";
import { atom, useAtom, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";

import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, getIdTokenResult } from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";

import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import {
  globalScope,
  projectIdAtom,
  projectSettingsAtom,
  updateProjectSettingsAtom,
  publicSettingsAtom,
  updatePublicSettingsAtom,
  currentUserAtom,
  userRolesAtom,
  userSettingsAtom,
  updateUserSettingsAtom,
} from "@src/atoms/globalScope";
import { SETTINGS, PUBLIC_SETTINGS, USERS } from "@src/config/dbPaths";

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

/**
 * Store Firebase config here so it can be set programmatically.
 * This lets us switch between Firebase projects.
 * Then app, auth, db, storage need to be derived atoms.
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

/**
 * When rendered, connects to a Firebase project.
 *
 * Sets project ID, project settings, public settings, current user, user roles, and user settings.
 */
export const ProjectSourceFirebase = memo(function ProjectSourceFirebase() {
  // Set projectId from Firebase project
  const [firebaseConfig] = useAtom(firebaseConfigAtom, globalScope);
  const setProjectId = useSetAtom(projectIdAtom, globalScope);
  useEffect(() => {
    setProjectId(firebaseConfig.projectId || "");
  }, [firebaseConfig.projectId, setProjectId]);

  // Get current user and store in atoms
  const [firebaseAuth] = useAtom(firebaseAuthAtom, globalScope);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom, globalScope);
  const setUserRoles = useSetAtom(userRolesAtom, globalScope);
  // Must use `useAtomCallback`, otherwise `useAtom(updateUserSettingsAtom)`
  // will cause infinite re-render
  const updateUserSettings = useAtomCallback(
    useCallback((get) => get(updateUserSettingsAtom), []),
    globalScope
  );

  useEffect(() => {
    // Suspend when currentUser has not been read yet
    (setCurrentUser as any)(new Promise(() => {}));

    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user) {
        // Get user roles
        const tokenResult = await getIdTokenResult(user);
        const roles = (tokenResult.claims.roles as string[]) ?? [];
        setUserRoles(roles);

        // Update user settings doc with roles for User Management page
        const _updateUserSettings = await updateUserSettings();
        if (_updateUserSettings) _updateUserSettings({ roles });
      } else {
        setUserRoles([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [firebaseAuth, setCurrentUser, setUserRoles, updateUserSettings]);

  // Store public settings in atom
  useFirestoreDocWithAtom(publicSettingsAtom, globalScope, PUBLIC_SETTINGS, {
    updateDataAtom: updatePublicSettingsAtom,
  });

  // Store project settings in atom when a user is signed in.
  // If they have no access, display AccessDenied screen via ErrorBoundary.
  useFirestoreDocWithAtom(
    projectSettingsAtom,
    globalScope,
    currentUser ? SETTINGS : undefined,
    { updateDataAtom: updateProjectSettingsAtom }
  );

  // Store user settings in atom when a user is signed in
  useFirestoreDocWithAtom(userSettingsAtom, globalScope, USERS, {
    pathSegments: [currentUser?.uid],
    createIfNonExistent: currentUser
      ? {
          user: {
            email: currentUser.email || "",
            displayName: currentUser.displayName || undefined,
            photoURL: currentUser.photoURL || undefined,
            phoneNumber: currentUser.phoneNumber || undefined,
          },
        }
      : undefined,
    updateDataAtom: updateUserSettingsAtom,
  });

  return null;
});

export default ProjectSourceFirebase;
