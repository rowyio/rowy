import * as functions from "firebase-functions";
import * as _ from "lodash";
import { db } from "../config";

const historySnapshot = (collection: string, trackedFields) => async (
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const docId = context.params.docId;
  const before = change.before.data();
  const after = change.after.data();
  if (!before || !after) return false;
  const trackedChanges: any = {};
  trackedFields.forEach(field => {
    if (!_.isEqual(before[field], after[field]))
      trackedChanges[field] = after[field];
  });
  if (!_.isEmpty(trackedChanges)) {
    await db
      .collection(collection)
      .doc(docId)
      .collection("historySnapshots")
      .add({ ...before, archivedAt: new Date() });
    return true;
  } else return false;
};

const historySnapshotFnsGenerator = collection =>
  functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(historySnapshot(collection.name, collection.trackedFields));

export default historySnapshotFnsGenerator;
