import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { collectionPath } from "./functionConfig"; // generated using generateConfig.ts
const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);
const docCreated = (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { subCollectionId } = context.params;
  return snapshot.ref.parent.parent?.update({
    [`${subCollectionId}.count`]: increment,
  });
};

const docDelete = (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { subCollectionId } = context.params;
  return snapshot.ref.parent.parent?.update({
    [subCollectionId]: decrement,
  });
};
const subTableFnsGenerator = {
  onCreate: functions.firestore
    .document(`${collectionPath}/{parentId}/{subCollectionId}/{docId}`)
    .onCreate(docCreated),
  onDelete: functions.firestore
    .document(`${collectionPath}/{parentId}/{subCollectionId}/{docId}`)
    .onDelete(docDelete),
};

export const FT_subTableStats = {
  [collectionPath]: { ...subTableFnsGenerator },
};
