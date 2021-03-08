import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db, auth } from "../firebaseConfig";
import utilFns from "../utils";
const shouldEvaluateReducer = (listeners, before, after) =>
  listeners.reduce((acc: Boolean, currField: string) => {
    if (acc) return true;
    else
      return (
        JSON.stringify(before[currField]) !== JSON.stringify(after[currField])
      );
  }, false);

const derivative = (
  functionConfig: {
    fieldName: string;
    listenerFields: string[];
    evaluate: (props: {
      row: any;
      ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
      db: FirebaseFirestore.Firestore;
      auth: admin.auth.Auth;
      utilFns: any;
    }) => any;
  }[]
) => async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
) => {
  try {
    const beforeData = change.before?.data();
    const afterData = change.after?.data();
    const ref = change.after ? change.after.ref : change.before.ref;
    const update = await functionConfig.reduce(
      async (accUpdates: any, currDerivative) => {
        const shouldEval = shouldEvaluateReducer(
          currDerivative.listenerFields,
          beforeData,
          afterData
        );
        if (shouldEval) {
          const newValue = await currDerivative.evaluate({
            row: afterData,
            ref,
            db,
            auth,
            utilFns,
          });
          if (
            newValue !== undefined &&
            newValue !== afterData[currDerivative.fieldName]
          ) {
            return {
              ...(await accUpdates),
              [currDerivative.fieldName]: newValue,
            };
          }
        }
        return await accUpdates;
      },
      {}
    );
    return update;
  } catch (error) {
    console.log(`Derivatives Error`, error);
    return {};
  }
};

export default derivative;
