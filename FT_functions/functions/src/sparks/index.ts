import * as functions from "firebase-functions";
import { hasRequiredFields } from "../utils";
import { db, auth } from "../firebaseConfig";

const { PubSub } = require("@google-cloud/pubsub");
const pubSubClient = new PubSub();

const spark = (functionConfig) => async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const beforeData = change.before?.data();
  const afterData = change.after?.data();
  const ref = change.after ? change.after.ref : change.before.ref;
  const triggerType =
    Boolean(beforeData) && Boolean(afterData)
      ? "update"
      : Boolean(afterData)
      ? "create"
      : "delete";

  try {
    const sparkPromises = functionConfig.map(async (sparkConfig) => {
      const {
        topic,
        triggers,
        shouldRun,
        requiredFields,
        sparkBody,
      } = sparkConfig;
      const sparkContext = {
        row: triggerType === "delete" ? beforeData : afterData,
        ref,
        db,
        auth,
        change,
        triggerType,
        sparkConfig,
      };
      if (!triggers.includes(triggerType)) return false; //check if trigger type is included in the spark
      if (
        triggerType !== "delete" &&
        requiredFields &&
        requiredFields.length !== 0 &&
        !hasRequiredFields(requiredFields, afterData)
      )
        return false; // check if it hase required fields for the spark to run
      const dontRun = shouldRun ? !(await shouldRun(sparkContext)) : false; //
      if (dontRun) return false;
      const sparkData = await Object.keys(sparkBody).reduce(
        async (acc, key) => ({
          [key]: await sparkBody[key](sparkContext),
          ...(await acc),
        }),
        {}
      );
      console.log(JSON.stringify(sparkData));
      const messageBuffer = Buffer.from(JSON.stringify(sparkData), "utf8");
      await pubSubClient.topic(topic).publish(messageBuffer);
      return true;
    });
    await Promise.all(sparkPromises);
    return true;
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};

export default spark;
