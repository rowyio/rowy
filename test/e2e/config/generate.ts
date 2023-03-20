import { openSync, readFileSync, writeFileSync } from "fs";
import { Browser, BrowserContext, chromium } from "@playwright/test";
import { BASE_URL, signInAs } from "../utils";
import { getAuthToken, recordChanges } from "./auth";

const roles = ["ADMIN", "EDITOR", "VIEWER", "NOROLES"];

(async () => {
  let browser: Browser,
    context: BrowserContext,
    page,
    fileName,
    auth,
    unsubscribeRecordChanges;
  try {
    fileName = `${__dirname}/.generated_tests/${Date.now()}.test.ts`;
    openSync(fileName, "wx");

    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({ baseURL: `${BASE_URL}` });

    // console.log((context as any)._channel)
    page = await context.newPage();
    await (context as any)._enableRecorder({
      mode: "recording",
      language: "playwright-test",
      outputFile: fileName,
    });

    writeFileSync(fileName, "foo");

    auth = process.argv.find((e) => roles.includes(e.toUpperCase()));
    const token = auth && (await getAuthToken(`${auth.toLowerCase()}@rowy.io`));
    await signInAs(page)(token);

    unsubscribeRecordChanges = await recordChanges(fileName);
    await page.pause();
    await context.close();
    await browser.close();
    unsubscribeRecordChanges();
  } catch (error: any) {
    console.error(error);
  } finally {
    if (auth && fileName) {
      const file = readFileSync(fileName).toString();
      writeFileSync(
        fileName,
        file.replace(
          /(getByLabel\('JWT'\)\.fill\()(['|"].*['|"])(\);)/gm,
          `$1process.env.${auth.toUpperCase()}_USER_TOKEN as string$3`
        )
      );
    }
  }
})();
