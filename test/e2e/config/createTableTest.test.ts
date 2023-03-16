import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:7690/");
  await page.goto("http://localhost:7690/jwtAuth");
  await page.getByLabel("JWT").fill(process.env.ADMIN_USER_TOKEN as string);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.locator("html").click();
  await page.getByRole("button", { name: "Create table", exact: true }).click();
  await page.getByLabel("Collection name *").click();
  await page.getByLabel("Collection name *").fill("createTable");
  await page.locator(".MuiStepper-root > div:nth-child(3) > button").click();
  await page.getByLabel("Table name *").click();
  await page.getByLabel("Table name *").fill("Create Table stuff");
  await page.getByText("Create", { exact: true }).click();
  await page.getByRole("button", { name: "Add column" }).click();
  await page.getByLabel("Column name").fill("column");
  await page.getByRole("button", { name: "Field type" }).click();
  await page.getByText("Short Text").click();
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Column settings" }).click();
  await page.getByRole("menuitem", { name: "Delete column…" }).click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("link", { name: "Other" }).click();
  await page.getByRole("button", { name: "Edit table" }).nth(1).click();
  await page.locator(".mui-p20kj1-MuiStack-root").click();
  await page
    .locator("div")
    .filter({ hasText: "Table settings" })
    .locator("button")
    .click();
  await page.getByRole("button", { name: "Discard" }).click();
  await page.getByRole("button", { name: "Edit table" }).first().click();
  await page.locator("#table-settings-delete-button").click();
  await page.getByText("Delete table…").click();
  await page.getByRole("button", { name: "Delete" }).click();
});
