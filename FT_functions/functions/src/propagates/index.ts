import * as functions from "firebase-functions";
import { propagateChanges, removeCopiesOfDeleteDoc } from "./SourceFns";

export const propagateChangesOnTrigger = (
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
      return new Promise(() => false);
  }
};
