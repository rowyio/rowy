import { test, expect } from "@playwright/test";
import { ADMIN_USER_TOKEN, EDITOR_USER_TOKEN, signIn } from "./utils";

test.describe("table-create", () => {
  test.describe("admin-user", () => {
    test.beforeEach(async ({ page }) => {
      console.log(EDITOR_USER_TOKEN);
      // await signIn(page)(ADMIN_USER_TOKEN);
      await signIn(page)(EDITOR_USER_TOKEN);
    });

    test("should", async ({ page }) => {
      expect(true).toBeTruthy();
    });
  });

  // test.describe("editor-user", () => {
  //   test.beforeEach(async ({ page }) => {
  //     await signIn(page)(EDITOR_USER_TOKEN)
  //   });

  //   test("should create", async ({ page }) => {
  //     expect(true).toBeTruthy();
  //   });
  // });
});
