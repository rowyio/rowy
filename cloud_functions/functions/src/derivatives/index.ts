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
  ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
  beforeData: FirebaseFirestore.DocumentData,
  afterData: FirebaseFirestore.DocumentData
) => {
  const update = await functionConfig.reduce(
    async (accUpdates: any, currDerivative) => {
      const shouldEval = shouldEvaluateReducer(
        currDerivative.listenerFields,
        beforeData,
        afterData
      );
      if (shouldEval) {
        const newValue = await currDerivative.eval(db)({
          row: afterData,
          ref: { path: ref.path, id: ref.id },
        });
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
    return ref.update(update);
  }
  return false;
};

export const derivativeOnCreate = async (
  snapshot: functions.firestore.DocumentSnapshot
) => {
  const docData = snapshot.data();

  if (!docData) return false;
  return derivativeOnChange(snapshot.ref, {}, docData);
};

export const derivativeOnUpdate = async (
  Change: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const beforeData = Change.before.data();
  const afterData = Change.after.data();
  if (!beforeData || !afterData) return false;
  return derivativeOnChange(Change.after.ref, beforeData, afterData);
};

export const FT_derivatives = {
  [collectionPath.replace("-", "_")]: {
    onUpdate: functions.firestore
      .document(`${collectionPath}/{docId}`)
      .onUpdate(derivativeOnUpdate),
    onCreate: functions.firestore
      .document(`${collectionPath}/{docId}`)
      .onCreate(derivativeOnCreate),
  },
};
