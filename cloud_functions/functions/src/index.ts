import * as algolia from "algoliasearch";
import * as functions from "firebase-functions";
//import * as maps from "./maps";
import * as admin from "firebase-admin";
admin.initializeApp();
const env = functions.config();
export const updateAlgoliaRecord = functions.https.onCall(
  async (data: any, context: any) => {
    const client = algolia(env.algolia.appid, env.algolia.apikey);
    const index = client.initIndex(data.collection);
    await index.partialUpdateObject({
      objectID: data.id,
      ...data.doc,
    });
    return true;
  }
);

export const deleteAlgoliaRecord = functions.https.onCall(
  async (data: any, context: any) => {
    const client = algolia(env.algolia.appid, env.algolia.apikey);
    const index = client.initIndex(data.collection);
    await index.deleteObject(data.id);
    return true;
  }
);

exports.setUserAsAdmin = functions.auth.user().onCreate(async user => {
  // check if email is from antler domain and is verified then add an admin custom token
  console.log("user.emailVerified ", user.emailVerified);
  console.log("user.email ", user.email);

  if (
    user.emailVerified &&
    user.email &&
    user.email.split("@")[1] === "antler.co"
  ) {
    let additionalClaims = {
      admin: true,
    };

    await admin
      .auth()
      .createCustomToken(user.uid, additionalClaims)
      .then(function(customToken) {
        // Send token back to client
        console.log(user.email, "is now an admin");
      })
      .catch(function(error) {
        console.log("Error creating custom token:", error);
      });
  }

  return true;
});

//export const MAPS = maps;
