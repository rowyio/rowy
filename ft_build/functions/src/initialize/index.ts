import * as functions from "firebase-functions";
import utilFns from "../utils";
import { db, auth, storage } from "../firebaseConfig";
const initializedDoc = (
  columns: { fieldName: string; type: string; value?: any; script?: any }[]
) => async (snapshot: functions.firestore.DocumentSnapshot) =>
  columns.reduce(async (acc, column) => {
    if (snapshot.get(column.fieldName) !== undefined) return { ...(await acc) }; // prevents overwriting already initialised values
    if (column.type === "static") {
      return {
        ...(await acc),
        [column.fieldName]: column.value,
      };
    } else if (column.type === "null") {
      return { ...(await acc), [column.fieldName]: null };
    } else if (column.type === "dynamic") {
      return {
        ...(await acc),
        [column.fieldName]: await column.script({
          row: snapshot.data(),
          ref: snapshot.ref,
          db,
          auth,
          storage,
          utilFns,
        }),
      };
    } else return { ...(await acc) };
  }, {});
export default initializedDoc;
