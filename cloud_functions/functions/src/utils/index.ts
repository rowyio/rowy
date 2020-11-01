import * as admin from "firebase-admin";
import * as _ from "lodash";
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
import { sendEmail } from "./email";
import { hasAnyRole } from "./auth";

const characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function generateId(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default { generateId, sendEmail, serverTimestamp, hasAnyRole };
export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _.get(data, objKey, defaultValue);
};

export const hasRequiredFields = (requiredFields: string[], data: any) =>
  requiredFields.reduce((acc: boolean, currField: string) => {
    if (data[currField] === undefined || data[currField] === null) return false;
    else return acc;
  }, true);
export async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const identifyTriggerType = (beforeData, afterData) =>
  Boolean(beforeData) && Boolean(afterData)
    ? "update"
    : Boolean(afterData)
    ? "create"
    : "delete";
