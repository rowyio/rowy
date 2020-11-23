const fs = require("fs");
// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin
//const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

admin.initializeApp();
const db = admin.firestore();
const main = async (functionType: string, configString: string) => {
  let configData;
  switch (functionType) {
    case "FT_derivatives":
      const isCollectionGroup = configString.includes("/");
      const collectionPath = `${configString}`;
      const schemaPath = isCollectionGroup
        ? `/_FIRETABLE_/settings/groupSchema/${configString.split("/").pop()}`
        : `_FIRETABLE_/settings/schema/${collectionPath}`;
      const schemaDoc = await db.doc(schemaPath).get();
      const schemaData = schemaDoc.data();
      if (!schemaData) return;
      const derivativeColumns = Object.values(schemaData.columns).filter(
        (col: any) => col.type === "DERIVATIVE"
      );
      const config = derivativeColumns.reduce((acc, currColumn: any) => {
        return `${acc}{
            fieldName:'${currColumn.key}',eval:(db)=> async ({row,ref}) =>{${
          currColumn.config.script
        }},listenerFields:[${(currColumn.config.listenerFields ?? [])
          .map((f) => `"${f}"`)
          .join(",")}]},`;
      }, ``);

      configData = `export default [${config}]\nexport const collectionPath ="${collectionPath}"`;
      break;

    case "FT_aggregates":
      const _schemaDoc = await db
        .doc(`_FIRETABLE_/settings/schema/${configString}`)
        .get();
      const _schemaData = _schemaDoc.data();
      if (!_schemaData) return;
      const aggregateColumns = Object.values(_schemaData.columns).filter(
        (col: any) => col.type === "AGGREGATE"
      );
      const _config = aggregateColumns.reduce((acc, currColumn: any) => {
        return `${acc}{
            fieldName:'${
              currColumn.key
            }',eval:(db)=> async ({aggregateState,incrementor,triggerType,change,afterData,beforeData}) =>{${
          currColumn.config.script
        }},subtables:[${currColumn.config.subtables
          .map((t) => `"${t}"`)
          .join(",")}]},`;
      }, ``);

      configData = `export default [${_config}]\nexport const collectionPath ="${configString}"`;
      break;
    case "FT_subTableStats":
      configData = `export const collectionPath ="${configString}"\nexport default []`;
      break;
    default:
      configData = `export default ${configString}\n export const collectionPath=''`;
      break;
  }
  console.log({ configData });
  fs.writeFileSync("./src/functionConfig.ts", configData);
  return;
};

main(process.argv[2], process.argv[3])
  .catch((err) => console.log(err))
  .then(() => console.log("this will succeed"))
  .catch(() => "obligatory catch");
