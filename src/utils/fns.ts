import firebase from "firebase/app";
import _get from "lodash/get";
import _mapValues from "lodash/mapValues";
import _isPlainObject from "lodash/isPlainObject";

import { TABLE_GROUP_SCHEMAS, TABLE_SCHEMAS } from "@src/config/dbPaths";

/**
 * reposition an element in an array
 * @param arr array
 * @param old_index index of element to be moved
 * @param new_index new position of the moved element
 */
export const arrayMover = (
  arr: any[],
  old_index: number,
  new_index: number
) => {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
};

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

function convertBase(str, fromBase, toBase) {
  const add = (x, y, base: number) => {
    let z: number[] = [];
    const n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
      const xi = i < x.length ? x[i] : 0;
      const yi = i < y.length ? y[i] : 0;
      const zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }
    return z;
  };

  const multiplyByNumber = (num, x, base) => {
    if (num < 0) return null;
    if (num == 0) return [];

    let result: number[] = [];
    let power = x;
    while (true) {
      num & 1 && (result = add(result, power, base));
      num = num >> 1;
      if (num === 0) break;
      power = add(power, power, base);
    }

    return result;
  };

  const parseToDigitsArray = (str, base) => {
    const digits = str.split("");
    let arr: number[] = [];
    for (let i = digits.length - 1; i >= 0; i--) {
      const n = characters.indexOf(digits[i]);
      if (n == -1) return "0";
      arr.push(n);
    }
    return arr;
  };

  const digits = parseToDigitsArray(str, fromBase);
  if (digits === null) return "0";

  let outArray: number[] = [];
  let power: number[] | null = [1];
  for (let i = 0; i < digits.length; i++) {
    digits[i] &&
      (outArray = add(
        outArray,
        multiplyByNumber(digits[i], power, toBase),
        toBase
      ));
    power = multiplyByNumber(fromBase, power, toBase);
  }

  let out = "";
  for (let i = outArray.length - 1; i >= 0; i--) out += characters[outArray[i]];

  return out;
}

export const decrementId = (id, dec = 1) => {
  let newId = id.split("");
  const trailingZeros: string[] = [];
  const leadingZeros: string[] = [];
  const leadingId: string[] = [];
  while (newId[0] == "0") {
    leadingZeros.push(newId.shift());
  }
  // remove all the zeros
  while (newId[newId.length - 1] == "0") {
    trailingZeros.push(newId.pop());
  }
  // put back at most 6 zeros
  newId = newId.concat(trailingZeros.splice(0, 6));
  while (newId.length > 8) {
    leadingId.push(newId.shift());
  }
  const currentIndex: string | null = convertBase(newId.join(""), 62, 10);

  if (currentIndex === null) throw new Error("Could not convert id to number");

  if (parseInt(currentIndex) < 1 || Number.isNaN(parseInt(currentIndex)))
    return `${id}${convertBase(`${Math.random() * 10000}`, 10, 62)}`;
  console.log({ id, val: parseInt(currentIndex) });
  const newIndex = parseInt(currentIndex) - dec;

  return `${leadingZeros.join("")}${leadingId.join("")}${convertBase(
    `${newIndex}`,
    10,
    62
  )}${trailingZeros.join("")}`;
};

export const generateSmallerId = (id: string) => {
  const generated = id.split("");
  for (let i = generated.length - 1; i >= 0; i--) {
    const charIndex = characters.indexOf(id[i]);
    if (charIndex > 0) {
      generated[i] = characters[charIndex - 1];
      break;
    } else if (i > 0) {
      continue;
    } else {
      generated.push(characters[characters.length - 1]);
    }
  }

  // Ensure we don't get 00...0, then the next ID would be 00...0z,
  // which would appear as the second row
  if (generated.every((char) => char === characters[0]))
    generated.push(characters[characters.length - 1]);

  return generated.join("");
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
