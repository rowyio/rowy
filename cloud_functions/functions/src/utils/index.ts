import * as admin from "firebase-admin";
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
import { sendEmail } from "./email";
import { hasAnyRole } from "./auth";
export default { sendEmail, serverTimestamp, hasAnyRole };
