import * as algoliasearch from "algoliasearch";
import * as functions from "firebase-functions";

import { env } from "../config";
import collectionsConfig from "./collectionsConfig";
const APP_ID = env.algolia.app;
const ADMIN_KEY = env.algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);

// returns object of fieldsToSync
const algoliaReducer = docData => (acc: any, curr: string) => {
  if (docData[curr]) return { ...acc, [curr]: docData[curr] };
  else return acc;
};

const addToAlgolia = (fieldsToSync?: string[]) => (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const collectionName = snapshot.ref.parent.id;
  const objectID = snapshot.id;
  const docData = snapshot.data();
  const index = client.initIndex(collectionName);
  if (fieldsToSync === undefined)
    return index.addObject({ ...docData, objectID });
  const algoliaData = fieldsToSync.reduce(algoliaReducer(docData), {});
  return index.addObject({ ...algoliaData, objectID });
};

const updateAlgolia = (fieldsToSync?: string[]) => (
  snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const collectionName = snapshot.after.ref.parent.id;
  const objectID = snapshot.after.id;
  const docData = snapshot.after.data();
  const index = client.initIndex(collectionName);

  if (fieldsToSync === undefined)
    return index.saveObject({ ...docData, objectID });
  const algoliaData = fieldsToSync.reduce(algoliaReducer(docData), {});
  return index.addObject({ ...algoliaData, objectID });
};

const deleteFromAlgolia = (snapshot: FirebaseFirestore.DocumentSnapshot) => {
  const collectionName = snapshot.ref.parent.id;
  const objectID = snapshot.id;
  const index = client.initIndex(collectionName);
  return index.deleteObject(objectID);
};

module.exports = collectionsConfig.map(collection => ({
  [`${collection.name}_onCreate`]: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onCreate(addToAlgolia(collection.fieldsToSync)),
  [`${collection.name}_onUpdate`]: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(updateAlgolia(collection.fieldsToSync)),
  [`${collection.name}_onDelete`]: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onDelete(deleteFromAlgolia),
}));
