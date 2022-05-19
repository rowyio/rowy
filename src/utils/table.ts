import { mergeWith, isArray } from "lodash-es";
import type { User } from "firebase/auth";
import { TABLE_GROUP_SCHEMAS, TABLE_SCHEMAS } from "@src/config/dbPaths";

/**
 * Creates a standard user object to write to table rows
 * @param currentUser - The current signed-in user
 * @param data - Any additional data to include
 * @returns rowyUser object
 */
export const rowyUser = (currentUser: User, data?: Record<string, any>) => {
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

/**
 * Updates row data with the same behavior as Firestore’s setDoc with merge.
 * Merges objects recursively, but overwrites arrays.
 * @see https://stackoverflow.com/a/47554197/3572007
 * @param row - The source row to update
 * @param update - The partial update to apply
 * @returns The row with updated values
 */
export const updateRowData = <T = Record<string, any>>(
  row: T,
  update: Partial<T>
): T =>
  mergeWith(
    row,
    update,
    // If the proeprty to be merged is array, overwrite the array entirely
    (objValue, srcValue) => (isArray(objValue) ? srcValue : undefined)
  );

const ID_CHARACTERS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Generate an ID compatible with Firestore
 * @param length - The length of the ID to generate
 * @returns - Generated ID
 */
export const generateId = (length: number = 20) => {
  let result = "";
  const charactersLength = ID_CHARACTERS.length;
  for (var i = 0; i < length; i++)
    result += ID_CHARACTERS.charAt(
      Math.floor(Math.random() * charactersLength)
    );

  return result;
};

/**
 * Lexicographically decrement a given ID
 * @param id - The ID to decrement. If not provided, set to 20 `z` characters
 * @returns - The decremented ID
 */
export const decrementId = (id: string = "zzzzzzzzzzzzzzzzzzzz") => {
  const newId = id.split("");

  // Loop through ID characters from the end
  let i = newId.length - 1;
  while (i > -1) {
    const newCharacterIndex = ID_CHARACTERS.indexOf(newId[i]) - 1;

    newId[i] =
      ID_CHARACTERS[
        newCharacterIndex > -1 ? newCharacterIndex : ID_CHARACTERS.length - 1
      ];

    // If we don’t hit 0, we’re done
    if (newCharacterIndex > -1) break;

    // Otherwise, if we hit 0, we need to decrement the next character
    i--;
  }

  // Ensure we don't get 00...0, then the next ID would be 00...0z,
  // which would appear as the second row
  if (newId.every((x) => x === ID_CHARACTERS[0]))
    newId.push(ID_CHARACTERS[ID_CHARACTERS.length - 1]);

  return newId.join("");
};

// Gets sub-table ID in $1
const formatPathRegex = /\/[^\/]+\/([^\/]+)/g;

/** Format table path  */
export const formatPath = (
  tablePath: string,
  isCollectionGroup: boolean = false
) => {
  return `${
    isCollectionGroup ? TABLE_GROUP_SCHEMAS : TABLE_SCHEMAS
  }/${tablePath.replace(formatPathRegex, "/subTables/$1")}`;
};

/** Format sub-table name to store settings in user settings */
export const formatSubTableName = (tablePath: string) =>
  tablePath
    ? tablePath.replace(formatPathRegex, "/subTables/$1").replace(/\//g, "_")
    : "";
