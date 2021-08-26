import * as functions from "firebase-functions";
import derivative from "./derivatives";
import extension from "./extensions";
import {
  functionName,
  triggerPath,
  derivativesConfig,
  documentSelectConfig,
  extensionsConfig,
  initializeConfig,
  fieldTypes,
} from "./functionConfig";

import { getTriggerType, changedDocPath } from "./utils";
import propagate from "./propagates";
import initialize from "./initialize";
export const FT = {
  [functionName]: functions.firestore
    .document(triggerPath)
    .onWrite(async (change, context) => {
      const triggerType = getTriggerType(change);
      let promises: Promise<any>[] = [];
      const extensionPromises = extensionsConfig
        .filter((extensionConfig) =>
          extensionConfig.triggers.includes(triggerType)
        )
        .map((extensionConfig) =>
          extension(extensionConfig, fieldTypes)(change, context)
        );
      console.log(
        `#${
          extensionPromises.length
        } extensions will be evaluated on ${triggerType} of ${changedDocPath(
          change
        )}`
      );
      promises = extensionPromises;
      const propagatePromise = propagate(
        change,
        documentSelectConfig,
        triggerType
      );
      promises.push(propagatePromise);
      try {
        let docUpdates = {};
        if (triggerType === "update") {
          try {
            docUpdates = await derivative(derivativesConfig)(change);
          } catch (err) {
            console.log(`caught error: ${err}`);
          }
        } else if (triggerType === "create") {
          try {
            const initialData = await initialize(initializeConfig)(
              change.after
            );
            const derivativeData = await derivative(derivativesConfig)(change);
            docUpdates = { ...initialData, ...derivativeData };
          } catch (err) {
            console.log(`caught error: ${err}`);
          }
        }
        if (Object.keys(docUpdates).length !== 0) {
          promises.push(change.after.ref.update(docUpdates));
        }
        const result = await Promise.allSettled(promises);
        console.log(JSON.stringify(result));
      } catch (err) {
        console.log(`caught error: ${err}`);
      }
    }),
};
