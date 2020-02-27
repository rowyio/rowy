import * as algoliasearch from "algoliasearch";
import * as functions from "firebase-functions";
import * as _ from "lodash";
import { env } from "../config";

const APP_ID = env.algolia.app;
const ADMIN_KEY = env.algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);

const filterSnapshot = (
  field: { docPath: string; snapshot: any },
  preservedKeys: string[]
) => {
  return {
    docPath: field.docPath,
    ...preservedKeys.reduce((acc: any, currentKey: string) => {
      const value = _.get(field.snapshot, currentKey);
      if (value) {
        return { ...acc, snapshot: { [currentKey]: value, ...acc.snapshot } };
      } else return acc;
    }, {}),
  };
};

// returns object of fieldsToSync
const algoliaReducer = (docData: FirebaseFirestore.DocumentData) => (
  acc: any,
  curr: string | { fieldName: string; snapshotFields: string[] }
) => {
  if (typeof curr === "string") {
    if (docData[curr] && typeof docData[curr].toDate === "function") {
      return {
        ...acc,
        [curr]: docData[curr].toDate().getTime() / 1000,
      };
    } else if (docData[curr] !== undefined || docData[curr] !== null) {
      return { ...acc, [curr]: docData[curr] };
    } else {
      return acc;
    }
  } else {
    if (docData[curr.fieldName] && curr.snapshotFields) {
      return {
        ...acc,
        [curr.fieldName]: docData[curr.fieldName].map(snapshot =>
          filterSnapshot(snapshot, curr.snapshotFields)
        ),
      };
    } else {
      return acc;
    }
  }
};

const addToAlgolia = (fieldsToSync: string[]) => (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const collectionName = snapshot.ref.parent.id;
  const objectID = snapshot.id;
  const docData = snapshot.data();
  if (!docData) return false; // returns if theres no data in the doc
  const algoliaData = fieldsToSync.reduce(algoliaReducer(docData), {});
  if (Object.keys(algoliaData).length === 0) return false; // returns if theres nothing to sync
  const index = client.initIndex(collectionName); // initialize algolia index
  return index.addObject({ ...algoliaData, objectID }); // add new algolia entry
};

const updateAlgolia = (fieldsToSync: string[]) => (
  snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const collectionName = snapshot.after.ref.parent.id;
  const objectID = snapshot.after.id;
  const docData = snapshot.after.data();
  if (!docData) return false; // returns if theres no data in the doc
  const algoliaData = fieldsToSync.reduce(algoliaReducer(docData), {});
  if (Object.keys(algoliaData).length === 0) return false; // returns if theres nothing to sync
  const index = client.initIndex(collectionName); // initialize algolia index
  return index.saveObject({ ...algoliaData, objectID }); // add update algolia entry
};

const deleteFromAlgolia = (snapshot: FirebaseFirestore.DocumentSnapshot) => {
  const collectionName = snapshot.ref.parent.id;
  const objectID = snapshot.id;
  const index = client.initIndex(collectionName); // initialize algolia index
  return index.deleteObject(objectID); // delete algolia entry
};

/**
 * returns 3 different trigger functions (onCreate,onUpdate,onDelete) in an object
 * @param collection configuration object
 */
const algoliaFnsGenerator = collection => ({
  onCreate: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onCreate(addToAlgolia(collection.fieldsToSync)),
  onUpdate: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(updateAlgolia(collection.fieldsToSync)),
  onDelete: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onDelete(deleteFromAlgolia),
});

export default algoliaFnsGenerator;
