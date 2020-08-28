import * as admin from "firebase-admin";
import * as _ from "lodash";
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
import { sendEmail } from "./email";
import { hasAnyRole } from "./auth";
export default { sendEmail, serverTimestamp, hasAnyRole };
export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _.get(data, objKey, defaultValue);
};
