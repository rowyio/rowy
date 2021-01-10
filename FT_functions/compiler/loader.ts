const fs = require("fs");
const beautify = require("js-beautify").js;
// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin
//const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

admin.initializeApp();
// const serviceAccount = require("./antler-vc-firebase.json");
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

export const generateConfigFromTableSchema = async (schemaDocPath) => {
  const schemaDoc = await db.doc(schemaDocPath).get();
  const schemaData = schemaDoc.data();
  if (!schemaData) throw new Error("no schema found");
  const derivativeColumns = Object.values(schemaData.columns).filter(
    (col: any) => col.type === "DERIVATIVE"
  );
  const derivativesConfig = `[${derivativeColumns.reduce(
    (acc, currColumn: any) => {
      if (
        !currColumn.config.listenerFields ||
        currColumn.config.listenerFields.length === 0
      )
        throw new Error(
          `${currColumn.key} derivative is missing listener fields`
        );
      if (currColumn.config.listenerFields.includes(currColumn.key))
        throw new Error(
          `${currColumn.key} derivative has its own key as a listener field`
        );
      return `${acc}{\nfieldName:'${
        currColumn.key
      }',evaluate:async ({row,ref,db,auth,utilFns}) =>{${
        currColumn.config.script
      }},\nlistenerFields:[${currColumn.config.listenerFields
        .map((fieldKey) => `"${fieldKey}"`)
        .join(",\n")}]},\n`;
    },
    ""
  )}]`;

  const sparksConfig = schemaData.sparks ? schemaData.sparks : "[]";
  const collectionType = schemaDocPath.includes("subTables")
    ? "subCollection"
    : schemaDocPath.includes("groupSchema")
    ? "groupCollection"
    : "collection";
  let collectionId = "";
  let functionName = "";
  let triggerPath = "";
  switch (collectionType) {
    case "collection":
      collectionId = schemaDocPath.split("/").pop();
      functionName = `"${collectionId}"`;
      triggerPath = `"${collectionId}/{docId}"`;
      break;
    case "subCollection":
      let pathParentIncrement = 0;
      triggerPath = schemaDocPath
        .replace("/_FIRETABLE_/settings/schema/", "")
        .replace(/subTables/g, function () {
          pathParentIncrement++;
          return `{parentDoc${pathParentIncrement}}`;
        });
      functionName = schemaDocPath
        .replace("/_FIRETABLE_/settings/schema/", "")
        .replace(/\/subTables\//g, "_");
      break;
    case "groupCollection":
      collectionId = schemaDocPath.split("/").pop();
      const collectionDepth = schemaData.collectionDepth
        ? schemaData.collectionDepth
        : 2;
      triggerPath = "";
      for (let i = 1; i <= collectionDepth; i++) {
        triggerPath = triggerPath + `{parentCol${i}}/{parentDoc${i}}/`;
      }
      triggerPath = triggerPath + "{docId}";
      functionName = `CG_${collectionId}_${collectionDepth}`;
      break;
    default:
      break;
  }
  const exports = {
    triggerPath,
    functionName,
    derivativesConfig,
    sparksConfig,
  };

  const fileData = Object.keys(exports).reduce((acc, currKey) => {
    return `${acc}\nexport const ${currKey} = ${exports[currKey]}`;
  }, ``);
  fs.writeFileSync(
    "../functions/src/functionConfig.ts",
    beautify(fileData, { indent_size: 2 })
  );
};
