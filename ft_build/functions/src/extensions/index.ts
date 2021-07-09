import * as functions from "firebase-functions";
import utilFns, { hasRequiredFields, getTriggerType } from "../utils";
import { db, auth, storage } from "../firebaseConfig";

const extension = (extensionConfig, fieldTypes) => async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const beforeData = change.before?.data();
  const afterData = change.after?.data();
  const ref = change.after ? change.after.ref : change.before.ref;
  const triggerType = getTriggerType(change);
  try {
    const {
      label,
      type,
      triggers,
      shouldRun,
      requiredFields,
      extensionBody,
    } = extensionConfig;
    const extensionContext = {
      row: triggerType === "delete" ? beforeData : afterData,
      ref,
      db,
      auth,
      change,
      triggerType,
      extensionConfig,
      utilFns,
      fieldTypes,
      storage,
    };
    if (!triggers.includes(triggerType)) return false; //check if trigger type is included in the extension
    if (
      triggerType !== "delete" &&
      requiredFields &&
      requiredFields.length !== 0 &&
      !hasRequiredFields(requiredFields, afterData)
    ) {
      console.log("requiredFields are ", requiredFields, "type is", type);
      return false; // check if it hase required fields for the extension to run
    }
    const dontRun = shouldRun
      ? !(typeof shouldRun === "function"
          ? await shouldRun(extensionContext)
          : shouldRun)
      : false; //

    console.log(label, "type is ", type, "dontRun value is", dontRun);

    if (dontRun) return false;
    const extensionData = await extensionBody(extensionContext);
    console.log(`extensionData: ${JSON.stringify(extensionData)}`);
    const extensionFn = require(`./${type}`).default;
    await extensionFn(extensionData, extensionContext);
    return true;
  } catch (err) {
    const { label, type } = extensionConfig;
    console.log(
      `error in ${label} extension of type ${type}, on ${context.eventType} in Doc ${context.resource.name}`
    );
    console.error(err);
    return Promise.reject(err);
  }
};

export default extension;
