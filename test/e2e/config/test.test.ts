import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:7690/jwtAuth");
  await page
    .getByLabel("JWT")
    .fill(
      "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY3ODQ2MTQwMSwiZXhwIjoxNjc4NDY1MDAxLCJpc3MiOiJmaXJlYmFzZS1hdXRoLWVtdWxhdG9yQGV4YW1wbGUuY29tIiwic3ViIjoiZmlyZWJhc2UtYXV0aC1lbXVsYXRvckBleGFtcGxlLmNvbSIsInVpZCI6IjI2Q0pNcndsb3VOUndraUxvZk5LMDdETmdLaHcifQ."
    );
  await page.getByRole("button", { name: "Sign in" }).click();
  await page
    .locator("div")
    .filter({ hasText: "OtherAll Field TypesOpen" })
    .first()
    .click({
      clickCount: 6,
    });
});
