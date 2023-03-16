import { Page } from "@playwright/test";

export const HOST = "localhost";
export const PORT = 7690;
export const BASE_URL = `${HOST}:${PORT}`;

export const ADMIN_USER_TOKEN = process.env.ADMIN_USER_TOKEN as string;
export const EDITOR_USER_TOKEN = process.env.EDITOR_USER_TOKEN as string;
export const VIEWER_USER_TOKEN = process.env.VIEWER_USER_TOKEN as string;
export const NOROLES_USER_TOKEN = process.env.NOROLES_USER_TOKEN as string;

export const signInAs = (page: Page) => async (token?: string) => {
  await page.goto(BASE_URL);
  if (token) {
    await page.goto(`${BASE_URL}/jwtAuth`);
    await page.getByLabel("JWT").fill(token);
    await page.getByRole("button", { name: "Sign in" }).click();
  }
};
