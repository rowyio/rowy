import algoliasearch from "algoliasearch";
import * as functions from "firebase-functions";
import * as _ from "lodash";
import { env } from "../config";
import fnConfig from "../functionConfig"; // generated using generateConfig.ts
const functionConfig: any = fnConfig;

const APP_ID = env.algolia ? env.algolia.app : "NEEDS_CONFIG";
const ADMIN_KEY = env.algolia ? env.algolia.key : "NEEDS_CONFIG";

const client = algoliasearch(APP_ID, ADMIN_KEY);

const missingFieldsReducer = (data: any) => (acc: string[], curr: string) => {
  if (data[curr] === undefined) {
    return [...acc, curr];
  } else return acc;
};

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
        [curr.fieldName]: docData[curr.fieldName].map((snapshot) =>
          filterSnapshot(snapshot, curr.snapshotFields)
        ),
      };
    } else {
      return acc;
    }
  }
};

const addToAlgolia = (
  config: any,
  fieldsToSync: string[],
  requiredFields: string[],
  indexName?: string
) => (
  snapshot: FirebaseFirestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  if (config.subTable && config.subTable !== context.params.subCollectionId)
    return false;
  const _index = indexName
    ? indexName
    : `${config.name}${config.subTable ? `_${config.subTable}` : ""}`;
  const objectID = snapshot.id;
  const docData = snapshot.data();
  if (!docData) return false; // returns if theres no data in the doc
  const missingRequiredFields = requiredFields.reduce(
    missingFieldsReducer(docData),
    []
  );
  if (missingRequiredFields.length > 0) {
    throw new Error(
      `Missing required fields:${missingRequiredFields.join(", ")}`
    );
  }
  const algoliaData = fieldsToSync.reduce(algoliaReducer(docData), {});
  if (Object.keys(algoliaData).length === 0) return false; // returns if theres nothing to sync
  const index = client.initIndex(_index); // initialize algolia index
  return index.saveObject({ ...algoliaData, objectID }); // add new algolia entry
};

const updateAlgolia = (
  config: any,
  fieldsToSync: string[],
  requiredFields: string[],
  indexName?: string
) => async (
  snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const objectID = snapshot.after.id;
  try {
    if (config.subTable && config.subTable !== context.params.subCollectionId)
      return false;
    const _index = indexName
      ? indexName
      : `${config.name}${config.subTable ? `_${config.subTable}` : ""}`;

    const docData = snapshot.after.data();
    if (!docData) return false; // returns if theres no data in the doc

    const missingRequiredFields = requiredFields.reduce(
      missingFieldsReducer(docData),
      []
    );
    if (missingRequiredFields.length > 0) {
      throw new Error(
        `Missing required fields:${missingRequiredFields.join(", ")}`
      );
    }
    const algoliaData = fieldsToSync.reduce(algoliaReducer(docData), {});
    if (Object.keys(algoliaData).length === 0) return false; // returns if theres nothing to sync
    const index = client.initIndex(_index); // initialize algolia index
    const algoliaTask = await index.saveObject({ ...algoliaData, objectID }); // add update algolia entry

    return algoliaTask;
  } catch (error) {
    console.error(JSON.stringify({ error, objectID }));
    return false;
  }
};

const deleteFromAlgolia = (config: any, indexName?: string) => (
  snapshot: FirebaseFirestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  if (config.subTable && config.subTable !== context.params.subCollectionId)
    return false;
  const _index = indexName
    ? indexName
    : `${config.name}${config.subTable ? `_${config.subTable}` : ""}`;
  const objectID = snapshot.id;
  const index = client.initIndex(_index); // initialize algolia index
  return index.deleteObject(objectID); // delete algolia entry
};

const documentPathGenerator = (config) =>
  `${
    config.subTable
      ? `${config.name}/{parentId}/{subCollectionId}/{docId}`
      : `${config.name}/{docId}`
  }`;
/**
 * returns 3 different trigger functions (onCreate,onUpdate,onDelete) in an object
 * @param config configuration object
 */
const algoliaFnsGenerator = (config) => ({
  onCreate: functions.firestore
    .document(documentPathGenerator(config))
    .onCreate(
      config.indices
        ? (snapshot, context) =>
            Promise.all(
              config.indices.map((index) =>
                addToAlgolia(
                  config,
                  index.fieldsToSync,
                  config.requiredFields ?? [],
                  index.name
                )(snapshot, context)
              )
            )
        : addToAlgolia(config, config.fieldsToSync, config.requiredFields ?? [])
    ),
  onUpdate: functions.firestore
    .document(documentPathGenerator(config))
    .onUpdate(
      config.indices
        ? (snapshot, context) =>
            Promise.all(
              config.indices.map((index) =>
                updateAlgolia(
                  config,
                  index.fieldsToSync,
                  config.requiredFields ?? [],
                  index.name
                )(snapshot, context)
              )
            )
        : updateAlgolia(
            config,
            config.fieldsToSync,
            config.requiredFields ?? []
          )
    ),
  onDelete: functions.firestore
    .document(documentPathGenerator(config))
    .onDelete(
      config.indices
        ? (snapshot, context) =>
            Promise.all(
              config.indices.map((index) =>
                deleteFromAlgolia(config, index.name)(snapshot, context)
              )
            )
        : deleteFromAlgolia(config)
    ),
});

export const FT_algolia = {
  [`${functionConfig.name}${
    functionConfig.subTable ? `${functionConfig.subTable}` : ""
  }`]: { ...algoliaFnsGenerator(functionConfig) },
};
