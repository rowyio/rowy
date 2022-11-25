import { render } from "@testing-library/react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";

import Providers, { IProvidersProps } from "@src/Providers";
import ProjectSourceFirebase from "@src/sources/ProjectSourceFirebase";
import {
  envConfig,
  firebaseConfigAtom,
  firebaseAppAtom,
  firebaseAuthAtom,
  firebaseDbAtom,
} from "@src/sources/ProjectSourceFirebase";
import { currentUserAtom } from "@src/atoms/projectScope";

/** Initialize Firebase */
console.log("Initializing Firebase...");
const app = initializeApp(envConfig);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
connectFirestoreEmulator(db, "localhost", 9299);

/**
 * Render with Jotai `projectScope` providers
 * & `ProjectSourceFirebase` component
 */
export const customRender = (
  ui: React.ReactElement,
  initialAtomValues?: IProvidersProps["initialAtomValues"],
  disableProjectSource: boolean = false
) =>
  render(
    <Providers initialAtomValues={initialAtomValues}>
      {!disableProjectSource && <ProjectSourceFirebase />}
      {ui}
    </Providers>
  );

/**
 * Signs in with email and password.
 * Returns `initialAtomValues`, which must be passed to `customRender`.
 */
export const signIn = async (
  userType: "admin" | "ops" | "editor" | "viewer" | "noRoles"
) => {
  await signOut(auth);

  const userCredential = await signInWithEmailAndPassword(
    auth,
    `${userType}@example.com`,
    `${userType}User`
  );
  expect(userCredential.user.email?.toLowerCase()).toBe(
    `${userType}@example.com`.toLowerCase()
  );

  const tokenResult = await userCredential.user.getIdTokenResult();
  if (userType === "noRoles") expect(tokenResult.claims.roles).toBeUndefined();
  else expect(tokenResult.claims.roles).toContain(userType.toUpperCase());

  const initialAtomValues = [
    [firebaseConfigAtom, envConfig],
    [firebaseAppAtom, app],
    [firebaseAuthAtom, auth],
    [firebaseDbAtom, db],
    [currentUserAtom, userCredential.user],
  ] as const;

  return initialAtomValues;
};

/** Suppress Jotai warning about setting an initial value for derived atoms */
const realConsoleWarn = console.warn.bind(console.warn);
beforeAll(() => {
  console.warn = (msg) =>
    !msg.toString().includes("initial value for derived atom") &&
    realConsoleWarn(msg);
});
afterAll(() => {
  console.warn = realConsoleWarn;
});
