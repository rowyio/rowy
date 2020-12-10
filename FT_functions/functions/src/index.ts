import * as functions from "firebase-functions";
import derivative from "./derivatives";
import spark from "./sparks";
import {
  functionName,
  triggerPath,
  derivativesConfig,
  sparksConfig,
} from "./functionConfig";
// import { //db, auth,
//   env } from "./config";
//import * as admin from "firebase-admin";

/*export  const endpointTest = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    console.log({data,context})
    return context
  }
);*/

export const FT = {
  [functionName]: functions.firestore
    .document(triggerPath)
    .onWrite(async (change, context) => {
      let promises: Promise<any>[] = [];
      try {
        const sparkPromises = sparksConfig.map((sparkConfig) =>
          spark(sparkConfig)(change, context)
        );
        promises = sparkPromises;
      } catch (err) {}
      try {
        const derivativePromise = derivative(derivativesConfig)(
          change,
          context
        );
        promises.push(derivativePromise);
      } catch (err) {}
      await Promise.all(promises);
    }),
};
