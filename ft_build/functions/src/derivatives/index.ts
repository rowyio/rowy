import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db, auth, storage } from "../firebaseConfig";
import utilFns from "../utils";

const derivative = (
  functionConfig: {
    fieldName: string;
    listenerFields: string[];
    evaluate: (props: {
      row: any;
      ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
      db: FirebaseFirestore.Firestore;
      auth: admin.auth.Auth;
      storage: admin.storage.Storage;
      utilFns: any;
    }) => any;
  }[]
) => async (change: functions.Change<functions.firestore.DocumentSnapshot>) => {
  try {
    const row = change.after?.data();
    const ref = change.after ? change.after.ref : change.before.ref;
    const update = await functionConfig.reduce(
      async (accUpdates: any, currDerivative) => {
        const shouldEval = utilFns.hasChanged(change)([
          ...currDerivative.listenerFields,
          "_ft_forcedUpdateAt",
        ]);
        if (shouldEval) {
          try {
            const newValue = await currDerivative.evaluate({
              row,
              ref,
              db,
              auth,
              storage,
              utilFns,
            });
            if (
              newValue !== undefined &&
              newValue !== row[currDerivative.fieldName]
            ) {
              return {
                ...(await accUpdates),
                [currDerivative.fieldName]: newValue,
              };
            }
          } catch (error) {
            console.log(error);
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
