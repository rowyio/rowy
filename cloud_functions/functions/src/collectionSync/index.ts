import * as functions from "firebase-functions";

import { db } from "../config";

import * as _ from "lodash";
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
const cloneDoc = (targetCollection: string, fieldsToSync: string[]) => (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const docId = snapshot.id;
  const docData = snapshot.data();
  console.log(docData);
  if (!docData) return false; // returns if theres no data in the doc
  const syncData = fieldsToSync.reduce(docReducer(docData), {});
  if (Object.keys(syncData).length === 0) return false; // returns if theres nothing to sync
  console.log(`creating new doc or forcing update ${docId}`);
  db.collection(targetCollection)
    .doc(docId)
    .set(syncData, { merge: true })
    .catch(error => console.error(error));
  return true;
};

/**
 *
 * @param targetCollection
 * @param fieldsToSync
 */
const syncDoc = (targetCollection: string, fieldsToSync: string[]) => async (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const docId = snapshot.id;
  const docData = snapshot.data();
  if (!docData) return false; // returns if theres no data in the doc
  const syncData = fieldsToSync.reduce(docReducer(docData), {});

  if (Object.keys(syncData).length === 0) return false; // returns if theres nothing to sync
  const targetDoc = await db
    .collection(targetCollection)
    .doc(docId)
    .get();
  if (!targetDoc.exists) return false;
  const targetDocData = targetDoc.data();
  console.log(`syncing ${docId}`, targetDoc.exists, {
    targetDocData,
    docData,
    syncData,
  });
  db.collection(targetCollection)
    .doc(docId)
    .update(syncData)
    .catch(error => console.error(error));
  return true;
};

/**
 * onUpdate change to snapshot adapter
 * @param targetCollection
 * @param fieldsToSync
 */
const syncDocOnUpdate = (
  targetCollection: string,
  fieldsToSync: string[],
  forcedUpdate: boolean
) => (snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  // TODO: compare before and after for fields to sync
  const afterData = snapshot.after.data();
  const beforeData = snapshot.after.data();
  const hasChanged = !_.isEqual(afterData, beforeData);
  if (hasChanged) {
    if (forcedUpdate === true) {
      return cloneDoc(targetCollection, fieldsToSync)(snapshot.after);
    } else {
      return syncDoc(targetCollection, fieldsToSync)(snapshot.after);
    }
  } else {
    console.warn("no change detected");
    return false;
  }
};

/**
 * returns 2 different trigger functions (onCreate,onUpdate) in an object
 * @param collection configuration object
 */
const collectionSyncFnsGenerator = collection =>
  Object.entries({
    onCreate: collection.onCreate
      ? functions.firestore
          .document(`${collection.source}/{docId}`)
          .onCreate(cloneDoc(collection.target, collection.fieldsToSync))
      : null,
    onUpdate: collection.onUpdate
      ? functions.firestore
          .document(`${collection.source}/{docId}`)
          .onUpdate(
            syncDocOnUpdate(
              collection.target,
              collection.fieldsToSync,
              collection.forcedUpdate
            )
          )
      : null,
  }).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export default collectionSyncFnsGenerator;
