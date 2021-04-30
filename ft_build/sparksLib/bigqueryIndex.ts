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

const transformToSQLValue = (value: any, ftType: string) => {
  if (value === null || value === undefined) {
    return `null`;
  }

  const sanitise = (x: string) => x?.replace?.(/\"/g, '\\"') ?? "";

  switch (ftType) {
    case "SIMPLE_TEXT":
    case "LONG_TEXT":
    case "EMAIL":
    case "PHONE_NUMBER":
    case "CODE":
    case "RICH_TEXT":
    case "ID":
    case "SINGLE_SELECT":
    case "URL":
      // SQL type: STRING
      return `"${sanitise(value)}"`;
    case "JSON": // JSON
    case "FILE": // JSON
    case "IMAGE": // JSON
    case "USER": // JSON
    case "COLOR": // JSON
    case "DOCUMENT_SELECT":
    case "SERVICE_SELECT":
    case "ACTION":
    case "AGGREGATE":
    case "MULTI_SELECT": // array
      // SQL type: STRING
      return `"${sanitise(JSON.stringify(value))}"`;
    case "CHECK_BOX":
      // SQL type: BOOLEAN
      return value ? `true` : `false`;
    case "NUMBER":
    case "PERCENTAGE":
    case "RATING":
    case "SLIDER":
      // NUMERIC
      return Number(value);
    case "DATE":
    case "DATE_TIME":
    case "DURATION":
      // SQL type: TIMESTAMP
      if (!value?.toDate) {
        return `null`;
      }
      return `timestamp("${value.toDate()}")`;
    case "LAST":
    case "STATUS":
    case "SUB_TABLE":
    default:
      // unknown or meaningless to sync
      return `null`;
  }
};

const bigqueryIndex = async (payload, sparkContext) => {
  const { row, objectID, index, fieldsToSync } = payload;

  const { triggerType, change, fieldTypes } = sparkContext;
  const record = rowReducer(fieldsToSync, row);
  const { BigQuery } = require("@google-cloud/bigquery");
  const { getSecret } = require("../utils");

  const bigquery = new BigQuery();
  const { projectID } = await getSecret("algolia");
  const tableFullName = `${projectID}.firetable.${index}`;
  console.log(
    `projectID: ${projectID}, index: ${index}, tableFullName: ${tableFullName}`
  );

  // create dataset with exact name "firetable" if not exists
  async function preprocessDataset() {
    const dataset = bigquery.dataset("firetable");
    const res = await dataset.exists();
    const exists = res[0];
    if (!exists) {
      console.log("Dataset 'firetable' does not exist, creating dataset...");
      await dataset.create();
      console.log("Dataset 'firetable' created.");
    } else {
      console.log("Dataset 'firetable' exists.");
    }
  }

  async function preprocessTable() {
    const dataset = bigquery.dataset("firetable");
    const table = dataset.table(index);
    const res = await table.exists();
    const exists = res[0];
    if (!exists) {
      console.log(
        `Table '${index}' does not exist in dataset 'firetable', creating dataset...`
      );
      await table.create();
      console.log(`Table '${index}' created in dataset 'firetable'.`);
    } else {
      console.log(`Table 'firetable' exists in 'firetable'.`);
    }
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
    const keys = Object.keys(data).join(",");
    const values = Object.keys(data)
      .map((key) => transformToSQLValue(data[key], fieldTypes[key]))
      .join(",");
    const query = `INSERT INTO ${index}
    (objectID, ${keys})
    VALUES ("${objectID}", ${values})
    ;`;
    console.log(query);
    const res = await bigquery.query(query);
    console.log(res);
  }

  async function update(data) {
    const values = Object.keys(data)
      .map((key) => `${key}=${transformToSQLValue(data[key], fieldTypes[key])}`)
      .join(",");
    const query = `UPDATE ${index}
          SET ${values}
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

  // preprocess before starting index logic
  await preprocessDataset();
  await preprocessTable();
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
