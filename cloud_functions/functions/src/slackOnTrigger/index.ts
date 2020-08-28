import { firestore } from "firebase-functions";
import { hasRequiredFields, serverTimestamp } from "../utils";
import _config from "../functionConfig"; // generated using generateConfig.ts
import { db } from "../config";
const functionConfig: any = _config;
type SlackOnTriggerConfig = {
  collectionPath: string;
  onCreate: Boolean;
  onUpdate: Boolean;
  onDelete: Boolean;
  requiredFields: string[];
  messageDocGenerator: (
    snapshot:
      | firestore.DocumentSnapshot
      | {
          before: firestore.DocumentSnapshot;
          after: firestore.DocumentSnapshot;
        }
    // db: FirebaseFirestore.Firestore
  ) => Boolean | any;
};
const slackOnCreate = (config: SlackOnTriggerConfig) =>
  firestore
    .document(`${config.collectionPath}/{docId}`)
    .onCreate(async (snapshot) => {
      try {
        const snapshotData = snapshot.data();
        if (!snapshotData) throw Error("no snapshot data");
        const hasAllRequiredFields = hasRequiredFields(
          config.requiredFields,
          snapshotData
        );
        if (hasAllRequiredFields) {
          const messageDoc = await config.messageDocGenerator(snapshot);
          if (messageDoc && typeof messageDoc === "object") {
            await db
              .collection("slackBotMessages")
              .add({ createdAt: serverTimestamp(), ...messageDoc });
            return true;
          } else {
            console.log("message is not sent");
            return false;
          }
        } else {
          console.log("requirements were not met");
          return false;
        }
      } catch (error) {
        console.warn(JSON.stringify(error.response.body));
        return false;
      }
    });

const slackOnUpdate = (config: SlackOnTriggerConfig) =>
  firestore
    .document(`${config.collectionPath}/{docId}`)
    .onUpdate(async (change) => {
      try {
        const beforeData = change.before.data();
        const afterData = change.after.data();
        if (!beforeData || !afterData) throw Error("no data found in snapshot");
        const hasAllRequiredFields = hasRequiredFields(
          config.requiredFields,
          afterData
        );
        if (hasAllRequiredFields) {
          const messageDoc = await config.messageDocGenerator(change);
          console.log({ messageDoc });
          if (messageDoc && typeof messageDoc === "object") {
            console.log("creating slack message doc");

            await db
              .collection("slackBotMessages")
              .add({ createdAt: serverTimestamp(), ...messageDoc });
            return true;
          } else {
            console.log("message is not sent");
            return false;
          }
        } else {
          console.log("requirements were not met");
          return false;
        }
      } catch (error) {
        console.warn(error);
        return false;
      }
    });

const slackOnTriggerFns = (config: SlackOnTriggerConfig) =>
  Object.entries({
    onCreate: config.onCreate ? slackOnCreate(config) : null,
    onUpdate: config.onUpdate ? slackOnUpdate(config) : null,
  }).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export const FT_slack = {
  [`${`${functionConfig.collectionPath}`
    .replace(/\//g, "_")
    .replace(/_{.*?}_/g, "_")}`]: slackOnTriggerFns(functionConfig),
};
