import { Page } from "@playwright/test";
import { FirestoreEvent } from "./output-builder";

export const getEvent = async (page: Page, index: number) => {
  const event = await page.evaluate(
    ([index]) => {
      if (!(window as any).__firestore_recorder) {
        return null;
      }
      return (window as any).__firestore_recorder.splice(
        index,
        1
      )[0] as FirestoreEvent;
    },
    [index]
  );
  return event;
};

export const getEvents = (page: Page): Promise<FirestoreEvent[]> =>
  page.evaluate(() => (window as any).__firestore_recorder || []);
