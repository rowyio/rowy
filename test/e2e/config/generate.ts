import * as fs from "fs";
import { chromium } from "@playwright/test";
import { BASE_URL, signInAs } from "../utils";
import { events, getAuthToken, listen } from "./auth";

const roles = ["ADMIN", "EDITOR", "VIEWER", "NOROLES"];

(async () => {
  let browser, context, page, fileName, auth;
  try {
    fileName = `${__dirname}/${Date.now()}.test.ts`;
    fs.openSync(fileName, "wx");
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({ baseURL: `${BASE_URL}` });
    page = await context.newPage();
    auth = process.argv.find((e) => roles.includes(e.toUpperCase()));

    await (context as any)._enableRecorder({
      mode: "recording",
      language: "playwright-test",
      outputFile: fileName,
    });

    const token = auth && (await getAuthToken(`${auth.toLowerCase()}@rowy.io`));
    await signInAs(page)(token);
    listen();
    await page.pause();
  } catch (error: any) {
    console.error(error);
  } finally {
    context && (await context.close());
    browser && (await browser.close());
    console.log("events: ", events);
    if (auth && fileName) {
      const file = fs.readFileSync(fileName).toString();
      fs.writeFileSync(
        fileName,
        file.replace(
          /(getByLabel\('JWT'\)\.fill\()(['|"].*['|"])(\);)/gm,
          `$1process.env.${auth.toUpperCase()}_USER_TOKEN as string$3`
        )
      );
    }
  }
})();
