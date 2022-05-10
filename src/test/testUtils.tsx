import { render } from "@testing-library/react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";

import Providers, { IProvidersProps } from "@src/Providers";
import ProjectSourceFirebase from "@src/sources/ProjectSourceFirebase";
import {
  envConfig,
  firebaseAuthAtom,
} from "@src/sources/ProjectSourceFirebase";
import { currentUserAtom } from "@src/atoms/globalScope";

/**
 * Render with Jotai `globalScope` providers
 * & `ProjectSourceFirebase` component
 */
export const customRender = (
  ui: React.ReactElement,
  initialAtomValues?: IProvidersProps["initialAtomValues"]
) =>
  render(
    <Providers initialAtomValues={initialAtomValues}>
      <ProjectSourceFirebase />
      {ui}
    </Providers>
  );

/**
 * Signs in with Google as an admin: admin(at)example.com
 * Returns `initialAtomValues`, which must be passed to `customRender`.
 */
export const signInAsAdmin = async () => {
  const app = initializeApp(envConfig);
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

  const userCredential = await signInWithEmailAndPassword(
    auth,
    "admin@example.com",
    "adminUser"
  );
  expect(userCredential.user.email).toBe("admin@example.com");

  const tokenResult = await userCredential.user.getIdTokenResult();
  expect(tokenResult.claims.roles).toContain("ADMIN");

  const initialAtomValues = [
    [firebaseAuthAtom, auth],
    // [currentUserAtom, userCredential.user],
  ] as const;

  return initialAtomValues;
};

// Suppress Jotai warning about setting an initial value for derived atoms
const realConsoleWarn = console.warn.bind(console.warn);
beforeAll(() => {
  console.warn = (msg) =>
    !msg.toString().includes("initial value for derived atom") &&
    realConsoleWarn(msg);
});
afterAll(() => {
  console.warn = realConsoleWarn;
});
