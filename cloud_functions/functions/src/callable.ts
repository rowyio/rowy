import * as functions from "firebase-functions";
import * as _ from "lodash";
import { hasAnyRole } from "./utils/auth";
import { auth } from "./config";

// Impersonator Auth callable takes email and returns JWT of user on firebaseAuth
// requires a user admin role

export const ImpersonatorAuth = functions.https.onCall(
  async (data, context) => {
    try {
      if (hasAnyRole(["ADMIN"], context)) {
        const user = await auth.getUserByEmail(data.email);
        const jwt = await auth.createCustomToken(user.uid);
        return {
          success: true,
          jwt,
          message: "successfully generated token",
        };
      } else {
        return {
          success: false,
          message: "admin role is required",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: JSON.stringify(error),
      };
    }
  }
);
