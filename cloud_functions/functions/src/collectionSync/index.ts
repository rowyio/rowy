import * as functions from "firebase-functions";

import { db } from "../config";

// returns object of fieldsToSync
const docReducer = (docData: FirebaseFirestore.DocumentData) => (
  acc: any,
  curr: string
) => {
  if (docData[curr]) return { ...acc, [curr]: docData[curr] };
  else return acc;
};

const syncDoc = (targetCollection: string, fieldsToSync: string[]) => (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const docId = snapshot.id;
  const docData = snapshot.data();
  if (!docData) return false; // returns if theres no data in the doc
  const syncData = fieldsToSync.reduce(docReducer(docData), {});
  if (Object.keys(syncData).length === 0) return false; // returns if theres nothing to sync
  db.collection(targetCollection)
    .doc(docId)
    .set(syncData, { merge: true })
    .catch(error => console.error(error));
  return true;
};

const syncDocOnUpdate = (targetCollection: string, fieldsToSync: string[]) => (
  snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => syncDoc(targetCollection, fieldsToSync)(snapshot.after);

/**
 * returns 3 different trigger functions (onCreate,onUpdate,onDelete) in an object
 * @param collection configuration object
 */
const collectionsSyncFnsGenerator = collection => ({
  onCreate: functions.firestore
    .document(`${collection.source}/{docId}`)
    .onCreate(syncDoc(collection.target, collection.fieldsToSync)),
  onUpdate: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(syncDocOnUpdate(collection.target, collection.fieldsToSync)),
});

export default collectionsSyncFnsGenerator;
