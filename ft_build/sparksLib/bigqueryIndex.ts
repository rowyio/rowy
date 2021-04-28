export const dependencies = {
  "@google-cloud/bigquery": "^5.5.0",
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

const bigqueryIndex = async (payload, sparkContext) => {
  const { row, objectID, index, fieldsToSync } = payload;

  const { triggerType, change } = sparkContext;
  const record = rowReducer(fieldsToSync, row);
  const { BigQuery } = require("@google-cloud/bigquery");
  const { getSecret } = require("../utils");

  const bigquery = new BigQuery();
  const { projectID } = await getSecret("algolia");
  console.log(`projectID: ${projectID}, index: ${index}`);

  // big query specifig helper functions
  type dataType = Record<string, string>;

  // return keys and values in SQL format
  // keys: key1,key2,key3
  // values: "val1","val2","val3"
  function formatData(data: dataType) {
    return {
      keys: Object.keys(data).join(","),
      values: Object.values(data)
        .map((value) => `"${value.replace(/\"/g, '\\"')}"`)
        .join(","),
    };
  }

  // return if the objectID exists in bool
  async function exist() {
    const query = `SELECT objectID FROM ${index}
    WHERE objectID="${objectID}"
    ;`;
    console.log(query);
    const res = await bigquery.query(query);
    const rows = res?.[0];
    return !!rows?.length;
  }

  async function insert(data) {
    const { keys, values } = formatData(data);
    const query = `INSERT INTO ${index}
    (objectID, ${keys})
    VALUES ("${objectID}", ${values})
    ;`;
    console.log(query);
    const res = await bigquery.query(query);
    console.log(res);
  }

  async function update(data: dataType) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const dictValues = Array.from(Array(keys.length).keys())
      .map((i) => `${keys[i]}="${values[i].replace(/\"/g, '\\"')}"`)
      .join(",");
    const query = `UPDATE ${index}
          SET ${dictValues}
          WHERE objectID="${objectID}"
          ;`;
    console.log(query);
    const res = await bigquery.query(query);
    console.log(res);
  }

  async function insertOrUpdate(data) {
    const objectExists = await exist();
    if (objectExists) {
      await update(data);
    } else {
      await insert(data);
    }
  }

  async function remove() {
    const query = `DELETE FROM ${index}
    WHERE objectID="${objectID}"
     ;`;
    console.log(query);
    const res = await bigquery.query(query);
    console.log(res);
  }

  switch (triggerType) {
    case "delete":
      await remove();
      break;
    case "update":
      if (
        significantDifference([...fieldsToSync, "_ft_forcedUpdateAt"], change)
      ) {
        await insertOrUpdate(record);
      }
      break;
    case "create":
      await insertOrUpdate(record);
      break;
    default:
      break;
  }
  return true;
};
export default bigqueryIndex;
