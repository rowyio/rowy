import * as functions from "firebase-functions";

import { db } from "../config";
import config, { collectionPath } from "../functionConfig";
// generated using generateConfig.ts
const functionConfig: any = config;

const shouldEvaluateReducer = (listeners, before, after) =>
  listeners.reduce((acc: Boolean, currField: string) => {
    if (acc) return true;
    else
      return (
        JSON.stringify(before[currField]) !== JSON.stringify(after[currField])
      );
  }, false);
export const derivativeOnChange = async (
  Change: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const beforeData = Change.before.data();
  const afterData = Change.after.data();
  if (!beforeData || !afterData) return false;
  const update = await functionConfig.reduce(
    async (accUpdates: any, currDerivative) => {
      const shouldEval = shouldEvaluateReducer(
        currDerivative.listenerFields,
        beforeData,
        afterData
      );
      if (shouldEval) {
        const newValue = await currDerivative.eval(db)(afterData);
        if (newValue !== undefined) {
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
  if (Object.keys(update).length !== 0) {
    return Change.after.ref.update(update);
  }
  return false;
};

export const FT_derivatives = {
  [collectionPath]: {
    onUpdate: functions.firestore
      .document(`${collectionPath}/{docId}`)
      .onUpdate(derivativeOnChange),
  },
};
