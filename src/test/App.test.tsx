import { customRender, signInAsAdmin } from "./testUtils";
import { screen, renderHook } from "@testing-library/react";
import { useAtom, useSetAtom } from "jotai";

import App from "@src/App";
import JotaiTestPage from "@src/pages/Test/JotaiTestPage";

import { globalScope, currentUserAtom } from "@src/atoms/globalScope";

test("renders without crashing", async () => {
  customRender(<JotaiTestPage />);
  expect(await screen.findByText(/Sign in with Google/i)).toBeInTheDocument();
  expect(await screen.findByText(/Authenticating/i)).toBeInTheDocument();
  expect(
    (await screen.findAllByText(/Project: rowy-testing/i)).length
  ).toBeGreaterThan(0);
});

test("signs in", async () => {
  const initialAtomValues = await signInAsAdmin();

  customRender(<App />, initialAtomValues, true);
  // const {
  //   result: { current: currentUser },
  // } = renderHook(() => useSetAtom(currentUserAtom, globalScope));
  // expect(currentUser).toBeDefined();

  // expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
  expect((await screen.findAllByText(/tablesd/i)).length).toBeGreaterThan(0);
});

// TODO:
// test("signs in without roles in auth")
