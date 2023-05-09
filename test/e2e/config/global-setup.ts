// global-setup.ts
import ReadLine from "readline";
import { promisify } from "util";
import { FullConfig } from "@playwright/test";
import {
  deleteCollections,
  deleteUsers,
  initializeUsers,
} from "@e2e/utils/firestore";
import { app } from "./firebase-config";

const readline = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = promisify(readline.question).bind(readline);

let checkProjectId = true;

async function globalSetup(config: FullConfig) {
  if (checkProjectId) {
    await prompt(`projectId: ${app.options.projectId}\nEnter to continue`);
    checkProjectId = false;
  }
  if (!app.options.projectId?.includes("testing")) {
    process.exit();
  }

  await deleteCollections();
  await deleteUsers();
  await initializeUsers();
}

export default globalSetup;
