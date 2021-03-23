export const dependencies = {};

const significantDifference = (fieldsToSync, change) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  return fieldsToSync.reduce((acc, field) => {
    if (JSON.stringify(beforeData[field]) !== JSON.stringify(afterData[field]))
      return true;
    else return acc;
  }, false);
};

const historySnapshot = async (data, sparkContext) => {
  const { trackedFields } = data;
  const { triggerType, change } = sparkContext;
  if (
    (triggerType === "update" &&
      significantDifference(trackedFields, change)) ||
    triggerType === "delete"
  ) {
    try {
      await change.before.ref.collection("historySnapshots").add({
        ...change.before.data(),
        archivedAt: new Date(),
        archiveEvent: triggerType,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return true;
};
export default historySnapshot;
