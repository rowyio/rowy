import { firestore } from "firebase-functions";

import { sendEmail } from "../utils/email";
import { hasRequiredFields } from "../utils";
import { db } from "../config";
import _config from "../functionConfig"; // generated using generateConfig.ts
const functionConfig: any = _config;
type EmailOnTriggerConfig = {
  collectionPath: string;
  templateId: string;
  categories: string[];
  onCreate: Boolean;
  from: Function;
  to: Function;
  attachments?: Function;
  bcc?: Function;
  cc?: Function;
  requiredFields: string[];
  shouldSend: (
    snapshot:
      | firestore.DocumentSnapshot
      | {
          before: firestore.DocumentSnapshot;
          after: firestore.DocumentSnapshot;
        }
  ) => Boolean;
  onUpdate: Boolean;
};
const emailOnCreate = (config: EmailOnTriggerConfig) =>
  firestore
    .document(`${config.collectionPath}/{docId}`)
    .onCreate(async (snapshot) => {
      try {
        const snapshotData = snapshot.data();
        if (!snapshotData) throw Error("no snapshot data");

        const shouldSend = config.shouldSend(snapshot);
        const hasAllRequiredFields = hasRequiredFields(
          config.requiredFields,
          snapshotData
        );
        const from = await config.from(snapshotData, db);
        const to = await config.to(snapshotData, db);

        const optionalFields = await ["attachments", "cc", "bcc"].reduce(
          async (accOptions, currOption) => {
            if (config[currOption]) {
              return {
                ...(await accOptions),
                [currOption]: await config[currOption](snapshotData, db),
              };
            } else return await accOptions;
          },
          {}
        );
        console.log(JSON.stringify({ optionalFields }));
        if (shouldSend && hasAllRequiredFields) {
          const msg = {
            from,
            personalizations: [
              {
                to,
                cc: optionalFields["cc"],
                bcc: optionalFields["bcc"],
                dynamic_template_data: {
                  ...snapshotData,
                },
              },
            ],
            template_id: config.templateId,
            categories: config.categories,
            attachments: optionalFields["attachments"],
          };
          console.log({ msg });
          const resp = await sendEmail(msg);
          console.log({ resp });
          return resp;
        } else {
          console.log("requirements were not met");
          return false;
        }
      } catch (error) {
        console.warn("Failed", JSON.stringify(error));
        return false;
      }
    });

const emailOnUpdate = (config: EmailOnTriggerConfig) =>
  firestore
    .document(`${config.collectionPath}/{docId}`)
    .onUpdate(async (change) => {
      try {
        const beforeData = change.before.data();
        const afterData = change.after.data();
        if (!beforeData || !afterData) throw Error("no data found in snapshot");
        const shouldSend = config.shouldSend(change);
        const hasAllRequiredFields = hasRequiredFields(
          config.requiredFields,
          afterData
        );
        const dynamic_template_data = config.requiredFields.reduce(
          (acc: any, curr: string) => {
            return { ...acc, [curr]: afterData[curr] };
          },
          {}
        );
        if (shouldSend && hasAllRequiredFields) {
          const from = await config.from(afterData, db);
          const to = await config.to(afterData, db);
          const msg = {
            from,
            personalizations: [
              {
                to,
                dynamic_template_data,
              },
            ],
            template_id: config.templateId,
            categories: config.categories,
          };
          await sendEmail(msg);

          return true;
        } else {
          console.log("requirements were not met");
          return false;
        }
      } catch (error) {
        console.warn(error);
        return false;
      }
    });

const emailOnTriggerFns = (config: EmailOnTriggerConfig) =>
  Object.entries({
    onCreate: config.onCreate ? emailOnCreate(config) : null,
    onUpdate: config.onUpdate ? emailOnUpdate(config) : null,
  }).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export const FT_email = {
  [`${`${functionConfig.collectionPath}`
    .replace(/\//g, "_")
    .replace(/_{.*?}_/g, "_")}`]: emailOnTriggerFns(functionConfig),
};
