export const dependencies = {
  algoliasearch: "^4.8.3",
};

const get = (obj, path, defaultValue = undefined) => {
  const travel = (regexp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

const filterSnapshot = (
  field: { docPath: string; snapshot: any },
  preservedKeys: string[]
) => {
  return {
    docPath: field.docPath,
    ...preservedKeys.reduce((acc: any, currentKey: string) => {
      const value = get(field.snapshot, currentKey);
      if (value) {
        return { ...acc, snapshot: { [currentKey]: value, ...acc.snapshot } };
      } else return acc;
    }, {}),
  };
};

// returns object of fieldsToSync
const rowReducer = (fieldsToSync, row) =>
  fieldsToSync.reduce(
    (
      acc: any,
      curr: string | { fieldName: string; snapshotFields: string[] }
    ) => {
      if (typeof curr === "string") {
        if (row[curr] && typeof row[curr].toDate === "function") {
          return {
            ...acc,
            [curr]: row[curr].toDate().getTime() / 1000,
          };
        } else if (row[curr] !== undefined || row[curr] !== null) {
          return { ...acc, [curr]: row[curr] };
        } else {
          return acc;
        }
      } else {
        if (row[curr.fieldName] && curr.snapshotFields) {
          return {
            ...acc,
            [curr.fieldName]: row[curr.fieldName].map((snapshot) =>
              filterSnapshot(snapshot, curr.snapshotFields)
            ),
          };
        } else {
          return acc;
        }
      }
    },
    {}
  );

const significantDifference = (fieldsToSync, change) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  return fieldsToSync.reduce((acc, field) => {
    const key = typeof field === "string" ? field : field.fieldName;
    if (JSON.stringify(beforeData[key]) !== JSON.stringify(afterData[key]))
      return true;
    else return acc;
  }, false);
};

const algoliaIndex = async (data, sparkContext) => {
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
      if (
        significantDifference([...fieldsToSync, "_ft_forcedUpdateAt"], change)
      ) {
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
export default algoliaIndex;
