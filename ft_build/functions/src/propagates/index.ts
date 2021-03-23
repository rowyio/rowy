import * as functions from "firebase-functions";
import { propagateChanges, removeCopiesOfDeleteDoc } from "./SourceFns";
import {
  addTargetRef,
  removeTargetRef,
  removeRefsOnTargetDelete,
} from "./TargetFns";
//import { asyncForEach} from '../utils'
const propagateChangesOnTrigger = (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  triggerType: "delete" | "create" | "update"
) => {
  switch (triggerType) {
    case "update":
      return propagateChanges(change.after);
    case "delete":
      return removeCopiesOfDeleteDoc(change.before.ref);
    case "create":
    default:
      return false;
  }
};

const updateLinks = (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  config: { fieldName: string; trackedFields: string[] }
) => {
  const beforeDocPaths = change.before.get(config.fieldName)
    ? change.before.get(config.fieldName).map((x) => x.docPath)
    : [];
  const afterDocPaths = change.after.get(config.fieldName)
    ? change.after.get(config.fieldName).map((x) => x.docPath)
    : [];
  const addedDocPaths = afterDocPaths.filter(
    (x) => !beforeDocPaths.includes(x)
  );
  const removedDocPaths = beforeDocPaths.filter(
    (x) => !afterDocPaths.includes(x)
  );
  if (addedDocPaths.length !== 0 || removedDocPaths.length !== 0) {
    const addPromises = addedDocPaths.map((docPath) =>
      addTargetRef(
        change.after.ref,
        docPath,
        config.fieldName,
        config.trackedFields
      )
    );
    const removePromises = removedDocPaths.map((docPath) =>
      removeTargetRef(change.after.ref, docPath, config.fieldName)
    );
    return Promise.all([...addPromises, ...removePromises]);
  } else {
    return false;
  }
};
export default function propagate(
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  config: { fieldName: string; trackedFields: string[] }[],
  triggerType: "delete" | "create" | "update"
) {
  const promises = [];
  if (["delete", "update"].includes(triggerType)) {
    const propagateChangesPromise = propagateChangesOnTrigger(
      change,
      triggerType
    );

    promises.push(propagateChangesPromise);
  }
  if (config.length > 0) {
    if (triggerType === "delete") {
      config.forEach((c) =>
        promises.push(removeRefsOnTargetDelete(change.before.ref, c.fieldName))
      );
    } else if (triggerType === "update") {
      config.forEach((c) => promises.push(updateLinks(change, c)));
    }
  }
  return Promise.allSettled(promises);
}
