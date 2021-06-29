import * as admin from "firebase-admin";
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
import { hasAnyRole } from "./auth";

const characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function generateId(length: number): string {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const hasRequiredFields = (requiredFields: string[], data: any) =>
  requiredFields.reduce((acc: boolean, currField: string) => {
    if (data[currField] === undefined || data[currField] === null) return false;
    else return acc;
  }, true);
async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const identifyTriggerType = (beforeData: any, afterData: any) =>
  Boolean(beforeData) && Boolean(afterData)
    ? "update"
    : Boolean(afterData)
    ? "create"
    : "delete";

export default {
  hasRequiredFields,
  generateId,
  serverTimestamp,
  hasAnyRole,
  asyncForEach,
  identifyTriggerType,
};
