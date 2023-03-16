// global-setup.ts
import { FullConfig } from "@playwright/test";
import { getAuthToken } from "./auth";

const users = [
  "ADMIN",
  "EDITOR",
  // "VIEWER",
  // "NOROLES"
];

async function globalSetup(config: FullConfig) {
  await Promise.all(
    users.map(async (user) =>
      getAuthToken(`${user.toLowerCase()}@rowy.io`).then((token) => {
        process.env[`${user}_USER_TOKEN`] = token;
      })
    )
  );
}

export default globalSetup;
