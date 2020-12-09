import * as functions from "firebase-functions";

import { db } from "../config";

import * as _ from "lodash";
import { replacer, identifyTriggerType } from "../utils";

import Config from "../functionConfig"; // generated using generateConfig.ts
const functionConfig: any = Config;

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
  for (const doc of targetDocs.docs) {
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
    if (!oldSnapshotsArray) {
      return targetRef.update({
        [snapshotField]: [
          { docPath: snapshot.ref.path, snapshot: newSnapshotData },
        ],
      });
    } else {
      const snapshotDocPath = snapshot.ref.path;
      const oldSnapshot = _.find(oldSnapshotsArray, {
        docPath: snapshotDocPath,
      });
      if (oldSnapshot) {
        return targetRef.update({
          [snapshotField]: oldSnapshotsArray.map(
            (item: { docPath: string; snapshot: any }) => {
              if (item.docPath === snapshotDocPath) {
                return {
                  ...oldSnapshot,
                  docPath: snapshotDocPath,
                  snapshot: newSnapshotData,
                };
              } else return item;
            }
          ),
        });
      } else {
        return targetRef.update({
          [snapshotField]: [
            ...oldSnapshotsArray,
            { docPath: snapshotDocPath, snapshot: newSnapshotData },
          ],
        });
      }
    }
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
const syncDocOnWrite = (config: {
  target: string;
  snapshotField: string;
  targetType: TargetTypes;
  fieldsToSync: string[];
  isArray: boolean;
}) => (snapshot: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
  const { fieldsToSync, target, snapshotField, targetType, isArray } = config;

  const afterDocData = snapshot.after.data();
  const beforeDocData = snapshot.before.data();

  const triggerType = identifyTriggerType(beforeDocData, afterDocData);

  const afterData = fieldsToSync.reduce(docReducer(afterDocData ?? {}), {});
  const beforeData = fieldsToSync.reduce(docReducer(beforeDocData ?? {}), {});
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
        return triggerType === "update"
          ? syncSubCollection(
              targetPath,
              snapshotField,
              { ...afterData, objectID: snapshot.after.ref.id },
              snapshot.after
            )
          : false;

      case TargetTypes.document:
        return triggerType !== "delete"
          ? syncDocSnapshot(
              targetPath,
              isArray,
              snapshotField,
              { ...afterData, objectID: snapshot.after.ref.id },
              snapshot.after
            )
          : false;
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
const snapshotSyncFnsGenerator = (config) =>
  functions.firestore
    .document(`${config.source}/{docId}`)
    .onWrite(syncDocOnWrite(config));

//export default snapshotSyncFnsGenerator;

export const FT_snapshotSync = functionConfig.fnName
  ? { [functionConfig.fnName]: snapshotSyncFnsGenerator(functionConfig) }
  : {
      [`${`${`${functionConfig.source}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}2${`${`${functionConfig.target}`
        .replace(/\//g, "_")
        .replace(/_{.*?}_/g, "_")}`}`]: snapshotSyncFnsGenerator(
        functionConfig
      ),
    };
