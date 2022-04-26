import { customRender, signIn } from "./testUtils";
import { screen } from "@testing-library/react";

import App from "@src/App";
import JotaiTest from "@src/pages/JotaiTest";

test("renders without crashing", async () => {
  customRender(<JotaiTest />);
  expect(await screen.findByText(/Sign in with Google/i)).toBeInTheDocument();
  expect(await screen.findByText(/{"emulator":true}/i)).toBeInTheDocument();
});

test("signs in", async () => {
  const initialAtomValues = await signIn();

  customRender(<App />, initialAtomValues);

  expect(await screen.findByText(/Nav/i)).toBeInTheDocument();
  expect(await screen.findByText(/Nav/i)).toBeInTheDocument();
  // expect(await screen.findByText(/{"emulator":true}/i)).toBeInTheDocument();
});
