import * as functions from "firebase-functions";
import * as maps from "./maps";
import * as claims from "./claims";
import { auth } from "./config";

exports.setUserAsAdmin = functions.auth.user().onCreate(async user => {
  // check if email is from antler domain and is verified then add an admin custom token
  console.log("user.emailVerified ", user.emailVerified);
  console.log("user.email ", user.email);

  if (
    user.emailVerified &&
    user.email &&
    user.email.split("@")[1] === "antler.co"
  ) {
    const customClaims = {
      roles: ["admin"],
    };

    await auth.setCustomUserClaims(user.uid, customClaims);
  }

  return true;
});

export const MAPS = maps;
export const CLAIMS = claims;

export { exportTable } from "./export";
export { updateAlgoliaRecord, deleteAlgoliaRecord } from "./algolia";
