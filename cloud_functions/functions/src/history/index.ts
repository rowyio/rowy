import * as functions from "firebase-functions";
import * as _ from "lodash";
import { db } from "../config";

const historySnapshot = (trackedFields: string[]) => async (
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const before = change.before.data();
  const after = change.after.data();
  const docPath = change.after.ref.path;
  if (!before || !after) return false;
  const trackedChanges: any = {};
  trackedFields.forEach(field => {
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

const historySnapshotFnsGenerator = collection =>
  functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(historySnapshot(collection.trackedFields));

export default historySnapshotFnsGenerator;
