import { db } from "../firebaseConfig";
const fs = require("fs");
const beautify = require("js-beautify").js;
import admin from "firebase-admin";
import { parseSparksConfig } from "../utils";

export const generateConfigFromTableSchema = async (
  schemaDocPath: string,
  user: admin.auth.UserRecord
) => {
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
      }',evaluate:async ({row,ref,db,auth,storage,utilFns}) =>{${
        currColumn.config.script
      }},\nlistenerFields:[${currColumn.config.listenerFields
        .map((fieldKey: string) => `"${fieldKey}"`)
        .join(",\n")}]},\n`;
    },
    ""
  )}]`;

  const initializableColumns = Object.values(
    schemaData.columns
  ).filter((col: any) => Boolean(col.config?.defaultValue));
  console.log(JSON.stringify({ initializableColumns }));
  const initializeConfig = `[${initializableColumns.reduce(
    (acc, currColumn: any) => {
      if (currColumn.config.defaultValue.type === "static") {
        return `${acc}{\nfieldName:'${currColumn.key}',
        type:"${currColumn.config.defaultValue.type}",
        value:${
          typeof currColumn.config.defaultValue.value === "string"
            ? `"${currColumn.config.defaultValue.value}"`
            : JSON.stringify(currColumn.config.defaultValue.value)
        },
       },\n`;
      } else if (currColumn.config.defaultValue.type === "dynamic") {
        return `${acc}{\nfieldName:'${currColumn.key}',
        type:"${currColumn.config.defaultValue.type}",
        script:async ({row,ref,db,auth,utilFns}) =>{${currColumn.config.defaultValue.script}},
       },\n`;
      } else {
        return `${acc}{\nfieldName:'${currColumn.key}',
        type:"${currColumn.config.defaultValue.type}"
       },\n`;
      }
    },
    ""
  )}]`;
  const documentSelectColumns = Object.values(schemaData.columns).filter(
    (col: any) => col.type === "DOCUMENT_SELECT" && col.config?.trackedFields
  );
  const documentSelectConfig = `[${documentSelectColumns.reduce(
    (acc, currColumn: any) => {
      return `${acc}{\nfieldName:'${
        currColumn.key
      }',\ntrackedFields:[${currColumn.config.trackedFields
        .map((fieldKey: string) => `"${fieldKey}"`)
        .join(",\n")}]},\n`;
    },
    ""
  )}]`;

  const sparksConfig = parseSparksConfig(schemaData.sparks, user);

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
      collectionId = schemaDocPath.split("/").pop() ?? "";
      functionName = `"${collectionId}"`;
      triggerPath = `"${collectionId}/{docId}"`;
      break;
    case "subCollection":
      let pathParentIncrement = 0;
      triggerPath =
        '"' +
        schemaDocPath
          .replace("_FIRETABLE_/settings/schema/", "")
          .replace(/subTables/g, function () {
            pathParentIncrement++;
            return `{parentDoc${pathParentIncrement}}`;
          }) +
        "/{docId}" +
        '"';
      functionName =
        '"' +
        schemaDocPath
          .replace("_FIRETABLE_/settings/schema/", "")
          .replace(/\/subTables\//g, "_") +
        '"';
      break;
    case "groupCollection":
      collectionId = schemaDocPath.split("/").pop() ?? "";
      const triggerDepth = schemaData.triggerDepth
        ? schemaData.triggerDepth
        : 1;
      triggerPath = "";
      for (let i = 1; i <= triggerDepth; i++) {
        triggerPath = triggerPath + `{parentCol${i}}/{parentDoc${i}}/`;
      }
      triggerPath = '"' + triggerPath + collectionId + "/" + "{docId}" + '"';
      functionName = `"CG_${collectionId}${
        triggerDepth > 1 ? `_D${triggerDepth}` : ""
      }"`;
      break;
    default:
      break;
  }
  const exports: any = {
    triggerPath,
    functionName: functionName.replace(/-/g, "_"),
    derivativesConfig,
    initializeConfig,
    documentSelectConfig,
    sparksConfig,
  };

  const fileData = Object.keys(exports).reduce((acc, currKey) => {
    return `${acc}\nexport const ${currKey} = ${exports[currKey]}`;
  }, ``);

  const path = require("path");
  fs.writeFileSync(
    path.resolve(__dirname, "../functions/src/functionConfig.ts"),
    beautify(fileData, { indent_size: 2 })
  );

  return true;
};
