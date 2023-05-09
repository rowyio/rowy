import { closeSync } from "fs";
import * as fs from "fs/promises";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";

import { BASE_URL, signInAs } from "@e2e/utils";
import { getAuthToken } from "@e2e/utils/auth";
import { OutputBuilder } from "@e2e/utils/output-builder";
import { getEvents } from "@e2e/utils/page";
import globalSetup from "./global-setup";
import globalTeardown from "./global-teardown";

const { auth, name = Date.now() } = process.argv
  .slice(2)
  .reduce((acc, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = value;
    return acc;
  }, {} as any);

const draftFileName = `${__dirname}/../.generated_tests/${name}.draft.ts`;
const finalFileName = `${__dirname}/../tests/${name}.test.ts`;

let draftFile: fs.FileHandle;
let browser: Browser | null;
let context: BrowserContext | null;
let page: Page | null;

const generator = async () => {
  await globalSetup({} as any);
  try {
    // await fs.mkdir(draftFileName, { recursive: true });
    draftFile = await fs.open(draftFileName, "wx");
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext({ baseURL: `${BASE_URL}` });
    page = await context.newPage();

    await (context as any)._enableRecorder({
      mode: "recording",
      language: "playwright-test",
      outputFile: draftFileName,
    });

    const token = auth && (await getAuthToken(`${auth.toLowerCase()}@rowy.io`));
    await signInAs(page)(token);
    await page.pause();
  } catch (error: any) {
    console.error(error);
  } finally {
    if (!page || !context || !browser) {
      throw Error("Something went wrong!");
    }
    const events = await getEvents(page);
    await page.close();
    page = null;
    await context.close();
    context = null;
    (await browser) && browser.close();
    browser = null;

    const output = (await fs.readFile(draftFileName)).toString();
    await fs.mkdir(finalFileName, { recursive: true });
    const finalFile = await fs.open(finalFileName, "wx");
    const finalOutput = OutputBuilder.build(output)
      .appendFirestoreMatchers(events)
      .replaceAuthRecord(auth)
      .replaceFirestoreRecords(events)
      .getContent();

    await fs.writeFile(finalFileName, finalOutput);
    closeSync(draftFile.fd);
    closeSync(finalFile.fd);
  }
  await globalTeardown({} as any);
  process.exit();
};

const exitHandler = async () => {
  await page?.close();
  await context?.close();
  await browser?.close();
};

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);

generator();
