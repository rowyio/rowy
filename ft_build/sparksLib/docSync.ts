export const dependencies = {};

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

const docSync = async (data, sparkContext) => {
  const { row, targetPath, fieldsToSync } = data;
  const { triggerType, change } = sparkContext;
  const record = rowReducer(fieldsToSync, row);
  const { db } = require("../firebaseConfig");

  switch (triggerType) {
    case "delete":
      try {
      await db.doc(targetPath).delete();
      }
      catch (error) {
        console.log(error);
      }
      break;
    case "update":
      if (
        significantDifference([...fieldsToSync, "_ft_forcedUpdateAt"], change)
      ) {
        try {
          await db.doc(targetPath).update(record);
        } catch (error) {
          console.log(error);
        }
      }
      break;
    case "create":
      await db.doc(targetPath).set(record, { merge: true });
      break;
    default:
      break;
  }
  return true;
};

export default docSync;
