const fs = require("fs");
const beautify = require("js-beautify").js;
// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin
//const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

//admin.initializeApp();
const serviceAccount = require("./antler-vc-firebase.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
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

  const sparksConfig = `[${
    schemaData.sparks ? schemaData.sparks.join(",\n") : ""
  }]`;
  const collectionId = schemaDocPath.split("/").pop();
  const functionName = `"${collectionId}"`;
  const triggerPath = `"${collectionId}/{docId}"`;
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

// const main = async (functionType: string, configString: string) => {
//   let configData;
//   switch (functionType) {

//     case "FT_aggregates":
//       const _schemaDoc = await db
//         .doc(`_FIRETABLE_/settings/schema/${configString}`)
//         .get();
//       const _schemaData = _schemaDoc.data();
//       if (!_schemaData) return;
//       const aggregateColumns = Object.values(_schemaData.columns).filter(
//         (col: any) => col.type === "AGGREGATE"
//       );
//       const _config = aggregateColumns.reduce((acc, currColumn: any) => {
//         return `${acc}{
//             fieldName:'${
//               currColumn.key
//             }',eval:(db)=> async ({aggregateState,incrementor,triggerType,change,afterData,beforeData}) =>{${
//           currColumn.config.script
//         }},subtables:[${currColumn.config.subtables
//           .map((t) => `"${t}"`)
//           .join(",")}]},`;
//       }, ``);

//       configData = `export default [${_config}]\nexport const collectionPath ="${configString}"`;
//       break;
//     case "FT_subTableStats":
//       configData = `export const collectionPath ="${configString}"\nexport default []`;
//       break;
//     default:
//       configData = `export default ${configString}\n export const collectionPath=''`;
//       break;
//   }
//   configData =
//     configData +
//     '\nexport const functionName =  collectionPath.replace("-", "_").replace(/\\//g, "_").replace(/_{.*?}_/g, "_")';
//   console.log({ configData });
//   fs.writeFileSync("./src/functionConfig.ts", configData);
//   return;
// };
