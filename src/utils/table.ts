import { mergeWith, isArray } from "lodash-es";
import type { User } from "firebase/auth";
import { TableRow } from "@src/types/table";

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
export const updateRowData = (row: TableRow, update: Partial<TableRow>) =>
  mergeWith(
    row,
    update,
    // If the proeprty to be merged is array, overwrite the array entirely
    (objValue, srcValue) => (isArray(objValue) ? srcValue : undefined)
  );
