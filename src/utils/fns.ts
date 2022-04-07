import firebase from "firebase/app";
import _get from "lodash/get";
import _mapValues from "lodash/mapValues";
import _isPlainObject from "lodash/isPlainObject";

import { TABLE_GROUP_SCHEMAS, TABLE_SCHEMAS } from "@src/config/dbPaths";

export const missingFieldsReducer =
  (data: any) => (acc: string[], curr: string) => {
    if (data[curr] === undefined) {
      return [...acc, curr];
    } else return acc;
  };

export const sanitiseCallableName = (name: string) => {
  if (!name || typeof name !== "string") return "";
  return name
    .replace("callable-", "")
    .replace(/([^A-Z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])(?=[a-z])/g, " $1");
};

export const isUrl = (str: string) => {
  const regex = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
  );
  return regex.test(str);
};

/**
 * Removes NaN from object so it can be serialised as Cloud Function input
 * @param rowData
 */
export const sanitiseRowData = (rowData: any) => {
  Object.keys(rowData).forEach((key) => {
    if (rowData[key] && typeof rowData[key] === "object")
      sanitiseRowData(rowData[key]);
    else if (typeof rowData[key] === "number" && isNaN(rowData[key]))
      delete rowData[key];
  });
  return rowData;
};

export const isCollectionGroup = () => {
  const pathName = window.location.pathname.split("/")[1];
  return pathName === "tableGroup";
};

const characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const makeId = (length: number = 20) => {
  let result = "";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));

  return result;
};

export const decrementId = (id: string) => {
  const newId = id.split("");

  // Loop through ID characters from the end
  let i = newId.length - 1;
  while (i > -1) {
    const newCharacterIndex = characters.indexOf(newId[i]) - 1;

    newId[i] =
      characters[
        newCharacterIndex > -1 ? newCharacterIndex : characters.length - 1
      ];

    // If we don’t hit 0, we’re done
    if (newCharacterIndex > -1) break;

    // Otherwise, if we hit 0, we need to decrement the next character
    i--;
  }

  // Ensure we don't get 00...0, then the next ID would be 00...0z,
  // which would appear as the second row
  if (newId.every((x) => x === characters[0]))
    newId.push(characters[characters.length - 1]);

  return newId.join("");
};

// Gets sub-table ID in $1
const formatPathRegex = /\/[^\/]+\/([^\/]+)/g;

export const formatPath = (tablePath: string) => {
  return `${
    isCollectionGroup() ? TABLE_GROUP_SCHEMAS : TABLE_SCHEMAS
  }/${tablePath.replace(formatPathRegex, "/subTables/$1")}`;
};

export const formatSubTableName = (tablePath) =>
  tablePath
    ? tablePath.replace(formatPathRegex, "/subTables/$1").replace(/\//g, "_")
    : null;

export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const getCellValue = (row: Record<string, any>, key: string) => {
  if (key.includes(".")) return _get(row, key);
  return row[key];
};

export function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object" && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

export const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object") {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

export const rowyUser = (
  currentUser: firebase.User,
  data?: Record<string, any>
) => {
  const { displayName, email, uid, emailVerified, isAnonymous, photoURL } =
    currentUser;

  return {
    timestamp: new Date(),
    displayName,
    email,
    uid,
    emailVerified,
    isAnonymous,
    photoURL,
    ...data,
  };
};
export const generateRandomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const _firestoreRefSanitizer = (v: any) => {
  // If react-hook-form receives a Firestore document reference, it tries to
  // clone firebase.firestore and exceeds maximum call stack size.
  if (firebase.firestore.DocumentReference.prototype.isPrototypeOf(v))
    return v.path;

  // Also test for arrays
  if (Array.isArray(v))
    return v.map((w) => {
      if (firebase.firestore.DocumentReference.prototype.isPrototypeOf(w))
        return w.path;
      return w;
    });

  // Also test for objects
  if (_isPlainObject(v)) return _mapValues(v, _firestoreRefSanitizer);

  return v;
};

export const sanitizeFirestoreRefs = (doc: Record<string, any>) =>
  _mapValues(doc, _firestoreRefSanitizer);

export const isTargetInsideBox = (target, box) => {
  const targetRect = target.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  return targetRect.y < boxRect.y + boxRect.height;
};

export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _get(data, objKey, defaultValue);
};
