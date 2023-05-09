import Bottleneck from "bottleneck";
import { Page, expect } from "@playwright/test";
import { omitDeep, waitFor } from "@e2e/config/utils";
import { getEvent, getEvents } from "./page";
// eslint-disable-next-line no-restricted-imports
import { mapValues } from "lodash";
import sortAny from "sort-any";

export type FirestoreEvent = {
  index: number;
  type: string;
  path: string;
  data?: any;
};

export type ValidateFirestoreEventOptions = {
  ignoreDocId?: boolean;
  omitFields?: string[];
};
export type ValidateFirestoreEvent = (
  index: number,
  path: string,
  options?: ValidateFirestoreEventOptions
) => Promise<void>;

export type FirestoreMatchers = {
  getLimiter: () => Bottleneck | undefined;
  enableFirestoreMatcher: () => void;
  readDoc: ValidateFirestoreEvent;
  readCollection: ValidateFirestoreEvent;
  createDoc: ValidateFirestoreEvent;
  updateDoc: ValidateFirestoreEvent;
  deleteDoc: ValidateFirestoreEvent;
};

const DEFAULT_OMIT_FIELDS = [
  "createdAt",
  "_createdBy.timestamp",
  "_createdBy.uid",
];

const sanitizeDocId = (path: string) =>
  path
    .split("/")
    .map((segment, _index) => (_index % 2 === 1 ? "{docId}" : segment))
    .join("/");

export const getFirestoreMatchers = (
  page: Page,
  expectedEvents: Array<FirestoreEvent>
): FirestoreMatchers => {
  let limiter: ReturnType<FirestoreMatchers["getLimiter"]>;
  const validateFirestoreEvent: ValidateFirestoreEvent = async (
    _index,
    path,
    options
  ) => {
    const { ignoreDocId = false, omitFields = [] } = options || {};

    const expectedIndex = expectedEvents.findIndex(
      (event) => event.path === path
    );
    expect(expectedIndex, "Event index could not found").not.toBe(-1);
    const expectedEvent = expectedEvents.splice(expectedIndex, 1)[0];
    expect(expectedEvent, "Event must be defined").toBeDefined();

    const {
      type: expectedType,
      path: expectedPath,
      data: expectedData = {},
    } = expectedEvent;

    const message = `index: ${_index} type: ${expectedType} path: ${expectedPath}`;
    let actualEvent = null;
    let count = 0;
    do {
      await waitFor(100);
      count++;
      const events = await getEvents(page);
      const index = events.findIndex((event) =>
        options?.ignoreDocId
          ? sanitizeDocId(expectedPath) === sanitizeDocId(event.path)
          : expectedPath === event.path
      );
      if (index === -1) continue;

      actualEvent = await getEvent(page, index);
    } while (!actualEvent && count < 20);

    expect(actualEvent, message).not.toBeNull();
    const {
      type: actualType,
      path: actualPath,
      data: actualData = {},
    } = actualEvent as FirestoreEvent;

    expect(expectedType, message).toBe(actualType);
    if (ignoreDocId) {
      expect(sanitizeDocId(expectedPath), message).toBe(
        sanitizeDocId(actualPath)
      );
    } else {
      expect(expectedPath, message).toBe(actualPath);
    }
    omitDeep(actualData, [...DEFAULT_OMIT_FIELDS, ...omitFields]);
    omitDeep(expectedData, [...DEFAULT_OMIT_FIELDS, ...omitFields]);
    expect(sortDeep(actualData || {}), message).toMatchObject(
      sortDeep(expectedData || {})
    );
  };
  return {
    getLimiter: () => limiter,
    enableFirestoreMatcher: () => {
      limiter = new Bottleneck({ maxConcurrent: 1 });
    },
    readDoc: limiter ? limiter.wrap(validateFirestoreEvent) : async () => {},
    readCollection: limiter
      ? limiter.wrap(validateFirestoreEvent)
      : async () => {},
    createDoc: limiter ? limiter.wrap(validateFirestoreEvent) : async () => {},
    updateDoc: limiter ? limiter.wrap(validateFirestoreEvent) : async () => {},
    deleteDoc: limiter ? limiter.wrap(validateFirestoreEvent) : async () => {},
  };
};

const sortDeep = (object: any): any => {
  if (object instanceof Map) {
    return sortAny([...(object as any)]);
  }
  if (!Array.isArray(object)) {
    if (
      typeof object !== "object" ||
      object === null ||
      object instanceof Date
    ) {
      return object;
    }

    return mapValues(object, sortDeep);
  }

  return sortAny(object.map(sortDeep));
};
