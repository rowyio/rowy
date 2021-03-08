import * as admin from "firebase-admin";

export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
// import { sendEmail } from "./email";
// import { hasAnyRole } from "./auth";
// import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// const secrets = new SecretManagerServiceClient();

// export const getSecret = async (name: string, v: string = "latest") => {
//   const [version] = await secrets.accessSecretVersion({
//     name: `projects/${process.env.GCLOUD_PROJECT}/secrets/${name}/versions/${v}`,
//   });
//   const payload = version.payload?.data?.toString();
//   if (payload && payload[0] === "{") {
//     return JSON.parse(payload);
//   } else {
//     return payload;
//   }
// };
// const characters =
//   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
// export function generateId(length: number): string {
//   let result = "";
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

// export const hasRequiredFields = (requiredFields: string[], data: any) =>
//   requiredFields.reduce((acc: boolean, currField: string) => {
//     if (data[currField] === undefined || data[currField] === null) return false;
//     else return acc;
//   }, true);
// async function asyncForEach(array: any[], callback: Function) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }
// export const getTriggerType = (change) =>
//   Boolean(change.after.data()) && Boolean(change.before.data())
//     ? "update"
//     : Boolean(change.after.data())
//     ? "create"
//     : "delete";

// export default {
//   getSecret,
//   hasRequiredFields,
//   generateId,
//   sendEmail,
//   serverTimestamp,
//   hasAnyRole,
//   asyncForEach,
// };
