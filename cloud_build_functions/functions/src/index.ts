import * as functions from "firebase-functions";
import { hasAnyRole } from "./utils/auth";
//import { serverTimestamp } from "./utils";
import { db } from "./firebaseConfig";
const { CloudBuildClient } = require("@google-cloud/cloudbuild");
const cb = new CloudBuildClient();

export const FT_triggerCloudBuild = functions.https.onCall(
  async (
    data: {
      schemaPath: string;
    },
    context: functions.https.CallableContext
  ) => {
    try {
      const authorized = hasAnyRole(["ADMIN"], context);
      const { schemaPath } = data;
      const firetableSettingsDoc = await db.doc("_FIRETABLE_/settings").get();
      const firetableSettings = firetableSettingsDoc.data();
      if (!firetableSettings) throw Error("Error: firetableSettings not found");
      const { triggerId, branch } = firetableSettings.cloudBuild;
      if (!context.auth || !authorized) {
        console.warn(`unauthorized user${context}`);
        return {
          success: false,
          message: "you don't have permission to trigger a build",
        };
      }
      // Starts a build against the branch provided.
      const [resp] = await cb.runBuildTrigger({
        projectId: process.env.GCLOUD_PROJECT, //project hosting cloud build
        triggerId,
        source: {
          branchName: branch,
          substitutions: {
            _PROJECT_ID: process.env.GCLOUD_PROJECT,
            _SCHEMA_PATH: schemaPath,
          },
        },
      });
      const buildId = resp.metadata.build.id;
      const logUrl = resp.metadata.build.logUrl;

      await db.doc(schemaPath).update({ cloudBuild: { logUrl, buildId } });
      console.log({ buildId, logUrl });

      if (buildId && logUrl) {
        return {
          message: "Deploying latest configuration",
          success: true,
        };
      }
      return false;
    } catch (err) {
      return {
        message: err,
        success: false,
      };
    }
  }
);

export const FT_cloudBuildUpdates = functions.pubsub
  .topic("cloud-builds")
  .onPublish(async (message, context) => {
    console.log(JSON.stringify(message));
    const { buildId, status } = message.attributes;
    console.log(JSON.stringify({ buildId, status }));
    //message
    //status: "SUCCESS"
    //buildId: "1a6d7819-aa35-486c-a29c-fb67eb39430f"

    const query = await db
      .collection("_FIRETABLE_/settings/schema")
      .where("cloudBuild.buildId", "==", buildId)
      .get();

    if (query.docs.length !== 0) {
      await query.docs[0].ref.update({ "cloudBuild.status": status });
    }
    return true;
  });
