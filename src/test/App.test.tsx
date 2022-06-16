import { customRender, signIn } from "./testUtils";
import { screen, fireEvent } from "@testing-library/react";

import App from "@src/App";
import JotaiTestPage from "@src/pages/Test/JotaiTestPage";

test("renders without crashing", async () => {
  customRender(<JotaiTestPage />);
  expect(await screen.findByText(/Sign in with Google/i)).toBeInTheDocument();
  expect(await screen.findByText(/Authenticating/i)).toBeInTheDocument();
  expect(
    (await screen.findAllByText(/Project: rowy-testing/i)).length
  ).toBeGreaterThan(0);
});

describe("sign in with roles", () => {
  test("signs in as admin", async () => {
    customRender(<App />, await signIn("admin"), true);
    expect((await screen.findAllByText(/tables/i)).length).toBeGreaterThan(0);

    const userMenuButton = screen.getByLabelText("Open user menu");
    expect(userMenuButton).toBeInTheDocument();
    fireEvent.click(userMenuButton);
    expect(await screen.findByText(/admin@example.com/i)).toBeInTheDocument();
  });

  test("signs in as ops", async () => {
    customRender(<App />, await signIn("ops"), true);
    expect((await screen.findAllByText(/tables/i)).length).toBeGreaterThan(0);

    const userMenuButton = screen.getByLabelText("Open user menu");
    expect(userMenuButton).toBeInTheDocument();
    fireEvent.click(userMenuButton);
    expect(await screen.findByText(/ops@example.com/i)).toBeInTheDocument();
  });

  test("signs in as editor", async () => {
    customRender(<App />, await signIn("editor"), true);
    expect((await screen.findAllByText(/tables/i)).length).toBeGreaterThan(0);

    const userMenuButton = screen.getByLabelText("Open user menu");
    expect(userMenuButton).toBeInTheDocument();
    fireEvent.click(userMenuButton);
    expect(await screen.findByText(/editor@example.com/i)).toBeInTheDocument();
  });

  test("signs in as viewer", async () => {
    customRender(<App />, await signIn("viewer"), true);
    expect((await screen.findAllByText(/tables/i)).length).toBeGreaterThan(0);

    const userMenuButton = screen.getByLabelText("Open user menu");
    expect(userMenuButton).toBeInTheDocument();
    fireEvent.click(userMenuButton);
    expect(await screen.findByText(/viewer@example.com/i)).toBeInTheDocument();
  });

  test("signs in with no roles", async () => {
    customRender(<App />, await signIn("noRoles"), true);

    expect(await screen.findByText(/Access denied/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Your account has no roles set/i)
    ).toBeInTheDocument();
  });
});
