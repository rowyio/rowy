import * as functions from "firebase-functions";

import { db } from "../config";

import * as _ from "lodash";
import { replacer } from "../utils/email";

enum TargetTypes {
  subCollection = "subCollection",
  document = "document",
}
/**
 * returns object with only keys included in fieldsToSync
 * @param docData
 */
const docReducer = (docData: FirebaseFirestore.DocumentData) => (
  acc: any,
  curr: string
) => {
  if (docData[curr] !== undefined && docData[curr] !== null) {
    return { ...acc, [curr]: docData[curr] };
  } else return acc;
};

/**
 *
 * @param targetPath
 * @param fieldsToSync
 */
const syncSubCollection = async (
  targetPath: string,
  snapshotField: string,
  syncData: any,
  snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
) => {
  const targetDocs = await db.collection(targetPath).get();
  if (targetDocs.empty) return false;
  for (let i = 0; i < targetDocs.docs.length; i++) {
    const doc = targetDocs.docs[i];
    await doc.ref.update({
      [snapshotField]: {
        docPath: snapshot.ref.path,
        snapshot: syncData,
      },
    });
  }
  return true;
};

const syncDocSnapshot = async (
  targetPath,
  isArray,
  snapshotField,
  newSnapshotData,
  snapshot
) => {
  console.log({
    targetPath,
    isArray,
    snapshotField,
  });
  const targetRef = db.doc(targetPath);
  const targetSnapshot = await targetRef.get();
  const targetData = targetSnapshot.data();
  if (!targetData) {
    console.warn("target does not exist");
    return false;
  }

  if (isArray) {
    const oldSnapshotsArray = targetData[snapshotField];
    const snapshotDocPath = snapshot.ref.path;
    const oldSnapshot = _.find(oldSnapshotsArray, { docPath: snapshotDocPath });

    const updatedSnapshotsArray = oldSnapshotsArray.filter(item => {
      console.log({ snapshotDocPath, item });
      return item.docPath !== snapshotDocPath;
    });
    updatedSnapshotsArray.push({ ...oldSnapshot, snapshot: newSnapshotData });

    return targetRef.update({ [snapshotField]: updatedSnapshotsArray });
  } else {
    return targetRef.update({
      [snapshotField]: {
        ...targetData[snapshotField],
        snapshot: newSnapshotData,
      },
    });
  }
};

/**
 * onUpdate change to snapshot adapter
 * @param targetCollection
 * @param fieldsToSync
 */
const syncDocOnUpdate = (config: {
  target: string;
  snapshotField: string;
  targetType: TargetTypes;
  fieldsToSync: string[];
  isArray: boolean;
}) => (snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const { fieldsToSync, target, snapshotField, targetType, isArray } = config;

  const afterDocData = snapshot.after.data();
  const beforeDocData = snapshot.before.data();
  if (!afterDocData || !beforeDocData) return false;
  const afterData = fieldsToSync.reduce(docReducer(afterDocData), {});
  const beforeData = fieldsToSync.reduce(docReducer(beforeDocData), {});
  const hasChanged = !_.isEqual(afterData, beforeData);
  console.log("nothing important changed");
  if (Object.keys(afterData).length === 0) return false; // returns if theres nothing to sync

  const targetPath = target.replace(
    /\{\{(.*?)\}\}/g,
    replacer({ ...snapshot.after.data(), id: snapshot.after.id })
  );
  console.log({ targetPath });
  if (targetPath === "") {
    console.log("unspecified target");
    return false;
  }
  console.log({ hasChanged, targetType });
  if (hasChanged) {
    switch (targetType) {
      case TargetTypes.subCollection:
        return syncSubCollection(
          targetPath,
          snapshotField,
          { ...afterData, objectID: snapshot.after.ref.id },
          snapshot.after
        );

      case TargetTypes.document:
        return syncDocSnapshot(
          targetPath,
          isArray,
          snapshotField,
          { ...afterData, objectID: snapshot.after.ref.id },
          snapshot.after
        );
      default:
        return false;
    }
  } else {
    console.warn("no change detected");
    return false;
  }
};

/**
 * returns 2 different trigger functions (onCreate,onUpdate) in an object
 * @param config configuration object
 */
const snapshotSyncFnsGenerator = config =>
  Object.entries({
    onUpdate: config.onUpdate
      ? functions.firestore
          .document(`${config.source}/{docId}`)
          .onUpdate(syncDocOnUpdate(config))
      : null,
  }).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export default snapshotSyncFnsGenerator;
