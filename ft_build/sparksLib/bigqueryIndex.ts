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

const transformToSQLData = (value: any, ftType: string) => {
  if (value === null || value === undefined) {
    return {
      value: `null`,
      type: "STRING",
    };
  }

  const sanitise = (x: string) =>
    x?.replace?.(/\"/g, '\\"')?.replace?.(/\n/g, "\\n") ?? "";

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
      return {
        value: `"${sanitise(value)}"`,
        type: "STRING",
      };
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
      return {
        value: `"${sanitise(JSON.stringify(value))}"`,
        type: "STRING",
      };
    case "CHECK_BOX":
      return {
        value: value ? `true` : `false`,
        type: "BOOLEAN",
      };
    case "NUMBER":
    case "PERCENTAGE":
    case "RATING":
    case "SLIDER":
      return {
        value: Number(value),
        type: "NUMERIC",
      };
    case "DATE":
    case "DATE_TIME":
    case "DURATION":
      if (!value?.toDate) {
        return {
          value: `null`,
          type: "TIMESTAMP",
        };
      }
      return {
        value: `timestamp("${value?.toDate?.()}")`,
        type: "TIMESTAMP",
      };
    case "LAST":
    case "STATUS":
    case "SUB_TABLE":
    default:
      // unknown or meaningless to sync
      return {
        value: `null`,
        type: "STRING",
      };
  }
};

const transformToSQLValue = (ftValue: any, ftType: string) => {
  const { value } = transformToSQLData(ftValue, ftType);
  return value;
};

const transformToSQLType = (ftType: string) => {
  const { type } = transformToSQLData("", ftType);
  return type;
};

const bigqueryIndex = async (payload, sparkContext) => {
  const { objectID, index, fieldsToSync, projectID, datasetLocation } = payload;

  const { triggerType, change, fieldTypes } = sparkContext;
  const record = rowReducer(fieldsToSync, sparkContext.row);
  const { BigQuery } = require("@google-cloud/bigquery");

  const bigquery = new BigQuery();
  const _projectID = projectID ?? process.env.GCLOUD_PROJECT;
  const tableFullName = `${_projectID}.firetable.${index}`;
  console.log(
    `projectID: ${_projectID}, index: ${index}, tableFullName: ${tableFullName}`
  );

  // create dataset with exact name "firetable" if not exists
  async function preprocessDataset() {
    const dataset = bigquery.dataset("firetable", {
      location: datasetLocation ?? "US",
    });
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
      console.log(`Table ${index} exists in 'firetable'.`);
    }
  }

  async function preprocessSchema() {
    const dataset = bigquery.dataset("firetable");
    const table = dataset.table(index);
    const generatedTypes = Object.keys(fieldTypes)
      .filter((field) => fieldsToSync.includes(field))
      .reduce((acc, cur) => {
        return {
          [cur]: transformToSQLType(fieldTypes[cur]),
          ...acc,
        };
      }, {});

    const generatedSchema = [
      { name: "objectID", type: "STRING", mode: "REQUIRED" },
      ...Object.keys(generatedTypes).map((key) => {
        return {
          name: key,
          type: generatedTypes[key],
          mode: "NULLABLE",
        };
      }),
    ];

    const pushSchema = async () => {
      console.log("pushing schema:", generatedSchema);
      const metadata = {
        schema: generatedSchema,
      };
      await table.setMetadata(metadata);
      console.log("schema pushed.");
    };

    const existingRes = await table.getMetadata();
    const existingSchema = existingRes[0].schema?.fields;

    if (!existingSchema) {
      console.log("Existing schema does not exist, pushing schema...");
      await pushSchema();
      return;
    }

    // check if schema update is needed
    const objectIDFilter = (field) => field.name !== "objectID";
    const schemaIdentical =
      Object.keys(generatedTypes).length ===
        existingSchema.filter(objectIDFilter).length &&
      existingSchema
        .filter(objectIDFilter)
        .every((field) => generatedTypes[field.name] === field.type);

    if (schemaIdentical) {
      // no change to schema
      console.log("Existing schema detected, no update needeed.");
      return;
    }

    // check schema compatibility (only new field is accpted)
    const compatible =
      Object.keys(generatedTypes).length >
        existingSchema.filter(objectIDFilter).length &&
      existingSchema
        .filter(objectIDFilter)
        .filter((field) => Object.keys(generatedTypes).includes(field.name))
        .every((field) => generatedTypes[field.name] === field.type);
    if (!compatible) {
      const errorMessage =
        "New update to field types is not compatible with existing schema. Please manually remove the current bigquery table or update spark index";
      console.log(errorMessage);
      throw errorMessage;
    } else {
      console.log(
        "New field types detected and it is compatible with current schema."
      );
    }

    // push schema
    await pushSchema();
  }

  // return if the objectID exists in bool
  async function exist() {
    const query = `SELECT objectID FROM ${tableFullName}
    WHERE objectID="${objectID}"
    ;`;
    console.log(query);
    const res = await bigquery.query(query);
    const rows = res?.[0];
    return !!rows?.length;
  }

  function getTypeKnownRecord(data) {
    const knownTypes = Object.keys(fieldTypes);
    const givenKeys = Object.keys(data);
    const knownKeys = givenKeys.filter((key) => knownTypes.includes(key));
    const unknownKeys = givenKeys.filter((key) => !knownTypes.includes(key));
    const knownRecord = Object.keys(data)
      .filter((key) => knownKeys.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: data[key],
        };
      }, {});

    if (unknownKeys?.length > 0) {
      console.log(
        "The following fields do not exist in Firetable and are ignored.",
        unknownKeys
      );
    }

    return knownRecord;
  }

  async function insert(data) {
    const keys = Object.keys(data).join(",");
    const values = Object.keys(data)
      .map((key) => transformToSQLValue(data[key], fieldTypes[key]))
      .join(",");
    const query = `INSERT INTO ${tableFullName}
    (objectID, ${keys})
    VALUES ("${objectID}", ${values})
    ;`;
    console.log(query);
    await executeQuery(query);
  }

  // execute a query, if rate limited, sleep and try again until success
  // ATTENTION: cloud function might timeout the function execution time at 60,000ms
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function executeQuery(query, delayDepth = 1) {
    try {
      const res = await bigquery.query(query);
      console.log(res);
    } catch (error) {
      if (
        error?.errors?.length === 1 &&
        (error?.errors?.[0]?.reason === "rateLimitExceeded" ||
          error?.errors?.[0]?.reason === "quotaExceeded")
      ) {
        const delay = Math.round(
          Math.floor(Math.random() * 3_000 * (delayDepth % 20) + 1000)
        );
        console.log(`API rate limited, try again in ${delay}ms`);
        await sleep(delay);
        await executeQuery(query, delayDepth + 1);
      } else {
        console.log(error?.errors ?? error);
      }
    }
    if (delayDepth === 1) {
      console.log("Query finished.");
    }
  }

  async function update(data) {
    const values = Object.keys(data)
      .map((key) => `${key}=${transformToSQLValue(data[key], fieldTypes[key])}`)
      .join(",");
    const query = `UPDATE ${tableFullName}
          SET ${values}
          WHERE objectID="${objectID}"
          ;`;
    console.log(query);
    await executeQuery(query);
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
    const query = `DELETE FROM ${tableFullName}
    WHERE objectID="${objectID}"
     ;`;
    console.log(query);
    await executeQuery(query);
  }

  // preprocess before starting index logic
  await preprocessDataset();
  await preprocessTable();
  await preprocessSchema();

  // only proceed with fields that have known types
  const typeKnownRecord = getTypeKnownRecord(record);

  switch (triggerType) {
    case "delete":
      await remove();
      break;
    case "update":
      if (
        significantDifference([...fieldsToSync, "_ft_forcedUpdateAt"], change)
      ) {
        await insertOrUpdate(typeKnownRecord);
      } else {
        console.log("significantDifference is false, no update needed.");
      }
      break;
    case "create":
      await insertOrUpdate(typeKnownRecord);
      break;
    default:
      break;
  }
  return true;
};
export default bigqueryIndex;
