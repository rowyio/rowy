import * as functions from "firebase-functions";

import { db } from "../config";

import * as _ from "lodash";
import { replacer } from "../utils/email";
// returns object of fieldsToSync
const docReducer = (docData: FirebaseFirestore.DocumentData) => (
  acc: any,
  curr: string
) => {
  if (docData[curr] !== undefined && docData[curr] !== null)
    return { ...acc, [curr]: docData[curr] };
  else return acc;
};

/**
 *
 * @param targetCollection
 * @param fieldsToSync
 */
const syncDoc = (
  targetCollection: string,
  snapshotField: string,
  fieldsToSync: string[]
) => async (snapshot: FirebaseFirestore.DocumentSnapshot) => {
  const docData = snapshot.data();
  if (!docData) return false; // returns if theres no data in the doc
  const syncData = fieldsToSync.reduce(docReducer(docData), {});

  const collectionPath = targetCollection.replace(
    /\{\{(.*?)\}\}/g,
    replacer({ ...docData, id: snapshot.id })
  );
  if (Object.keys(syncData).length === 0) return false; // returns if theres nothing to sync
  const targetDocs = await db.collection(collectionPath).get();
  if (targetDocs.empty) return false;

  for (let i = 0; i < targetDocs.docs.length; i++) {
    const doc = targetDocs.docs[i];
    await doc.ref.update({
      [snapshotField]: {
        docPath: snapshot.ref.path,
        snapshot: syncData,
      },
    });
  }
  return true;
};

/**
 * onUpdate change to snapshot adapter
 * @param targetCollection
 * @param fieldsToSync
 */
const syncDocOnUpdate = (
  targetCollection: string,
  snapshotField: string,
  fieldsToSync: string[]
) => (snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const afterData = snapshot.after.data();
  const beforeData = snapshot.before.data();
  const hasChanged = !_.isEqual(afterData, beforeData);
  if (hasChanged) {
    return syncDoc(
      targetCollection,
      snapshotField,
      fieldsToSync
    )(snapshot.after);
  } else {
    console.warn("no change detected");
    return false;
  }
};

/**
 * returns 2 different trigger functions (onCreate,onUpdate) in an object
 * @param collection configuration object
 */
const snapshotSyncFnsGenerator = collection =>
  Object.entries({
    onUpdate: collection.onUpdate
      ? functions.firestore
          .document(`${collection.source}/{docId}`)
          .onUpdate(
            syncDocOnUpdate(
              collection.target,
              collection.snapshotField,
              collection.fieldsToSync
            )
          )
      : null,
  }).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export default snapshotSyncFnsGenerator;
