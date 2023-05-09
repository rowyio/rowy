// global-teardown.ts
import { FullConfig } from "@playwright/test";
import { deleteCollections, deleteUsers } from "@e2e/utils/firestore";

async function globalTeardown(config: FullConfig) {
  await deleteUsers();
  await deleteCollections();
}

export default globalTeardown;
