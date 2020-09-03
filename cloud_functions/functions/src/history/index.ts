import * as functions from "firebase-functions";
import * as _ from "lodash";
import { db } from "../config";

import config from "../functionConfig"; // generated using generateConfig.ts
const functionConfig: any = config;

const historySnapshot = (trackedFields: string[]) => async (
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const before = change.before.data();
  const after = change.after.data();
  const docPath = change.after.ref.path;
  if (!before || !after) return false;
  const trackedChanges: any = {};
  trackedFields.forEach((field) => {
    if (!_.isEqual(before[field], after[field]))
      trackedChanges[field] = after[field];
  });
  if (!_.isEmpty(trackedChanges)) {
    await db
      .doc(docPath)
      .collection("historySnapshots")
      .add({ ...before, archivedAt: new Date() });
    return true;
  } else return false;
};

const historySnapshotFnsGenerator = (collection) =>
  functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(historySnapshot(collection.trackedFields));

//export default historySnapshotFnsGenerator;

export const FT_history = {
  [functionConfig.name
    .replace(/\//g, "_")
    .replace(/_{.*?}_/g, "_")]: historySnapshotFnsGenerator(functionConfig),
};
