// eslint-disable-next-line no-restricted-imports
import { isObject, unset } from "lodash";

export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

export const omitDeep = (value: unknown, keys: string[]) => {
  if (typeof value === "undefined") return {};

  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      value[i] = omitDeep(value[i], keys);
    }
    return value;
  }

  if (!isObject(value)) return value;

  if (typeof keys === "string") {
    keys = [keys];
  }

  if (!Array.isArray(keys)) return value;

  for (var j = 0; j < keys.length; j++) {
    unset(value, keys[j]);
  }

  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      (value as any)[key] = omitDeep((value as any)[key], keys);
    }
  }

  return value;
};
