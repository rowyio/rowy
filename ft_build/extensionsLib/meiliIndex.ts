export const dependencies = {
  meilisearch: "^0.18.1",
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

const meiliIndex = async (data, sparkContext) => {
  const { row, objectID, index, fieldsToSync } = data;

  const { triggerType, change } = sparkContext;
  const record = rowReducer(fieldsToSync, row);
  const { MeiliSearch } = require("meilisearch");
  const { getSecret } = require("../utils");
  const meiliConfig = await getSecret("meilisearch");
  console.log(`meilisearch host : ${meiliConfig.host}, index: ${index}`);
  const client = new MeiliSearch(meiliConfig);
  const _index = client.index(index);

  let res;
  switch (triggerType) {
    case "delete":
      console.log("Deleting...");
      res = await _index.deleteDocument(objectID);
      break;
    case "update":
      if (
        significantDifference([...fieldsToSync, "_ft_forcedUpdateAt"], change)
      ) {
        console.log("Updating...");
        res = await _index.updateDocuments([
          {
            id: objectID,
            ...record,
          },
        ]);
      }
      break;
    case "create":
      console.log("Creating...");
      res = await _index.addDocuments([
        {
          id: objectID,
          ...record,
        },
      ]);
      break;
    default:
      console.log("No match.");
      break;
  }
  console.log("Checking status...");
  if (res?.updateId) {
    console.log("Querying status...");
    const status = await client.index(index).getUpdateStatus(res.updateId);
    console.log("Status:", status);
  }

  return true;
};
export default meiliIndex;
