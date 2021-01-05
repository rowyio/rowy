import * as functions from "firebase-functions";
import derivative from "./derivatives";
import spark from "./sparks";
import {
  functionName,
  triggerPath,
  derivativesConfig,
  sparksConfig,
} from "./functionConfig";

import { getTriggerType } from "./utils";

export const FT = {
  [functionName]: functions.firestore
    .document(triggerPath)
    .onWrite(async (change, context) => {
      const triggerType = getTriggerType(change);
      let promises: Promise<any>[] = [];
      try {
        const sparkPromises = sparksConfig
          .filter((sparkConfig) => sparkConfig.triggers.includes(triggerType))
          .map((sparkConfig) => spark(sparkConfig)(change, context));
        console.log(
          `#${sparkPromises.length} sparks will be evaluted on ${triggerType}`
        );
        promises = sparkPromises;
      } catch (err) {}
      try {
        if (triggerType !== "delete") {
          const derivativePromise = derivative(derivativesConfig)(
            change,
            context
          );
          promises.push(derivativePromise);
        }
      } catch (err) {}
      await Promise.all(promises);
    }),
};
