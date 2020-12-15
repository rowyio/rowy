export const dependencies = {
  algoliasearch: "^4.8.3",
};

// returns object of fieldsToSync
const rowReducer = (fieldsToSync, row) =>
  fieldsToSync.reduce((acc: any, curr: string) => {
    if (row[curr] !== undefined && row[curr] !== null)
      return { ...acc, [curr]: row[curr] };
    else return acc;
  }, {});

const significantDifference = (fieldsToSync, change) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  return fieldsToSync.reduce((acc, field) => {
    if (JSON.stringify(beforeData[field]) !== JSON.stringify(afterData[field]))
      return true;
    else return acc;
  }, false);
};

const algoliaSpark = async (data, sparkContext) => {
  const { row, objectID, index, fieldsToSync } = data;

  const { triggerType, change } = sparkContext;
  const record = rowReducer(fieldsToSync, row);
  const algoliasearch = require("algoliasearch");
  const { getSecret } = require("../utils");
  const { appId, adminKey } = await getSecret("algolia");
  console.log(`algolia app id : ${appId}`);
  const client = algoliasearch(appId, adminKey);
  const _index = client.initIndex(index); // initialize algolia index

  switch (triggerType) {
    case "delete":
      await _index.deleteObject(objectID);
      break;
    case "update":
      if (significantDifference(fieldsToSync, change)) {
        _index.saveObject({ ...record, objectID });
      }
      break;
    case "create":
      await _index.saveObject({ ...record, objectID });
      break;
    default:
      break;
  }
  return true;
};
export default algoliaSpark;
