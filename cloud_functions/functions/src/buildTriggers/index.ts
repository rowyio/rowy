import * as functions from "firebase-functions";
import { hasAnyRole } from "../utils/auth";
import { serverTimestamp } from "../utils";
import { db } from "../config";
const { CloudBuildClient } = require("@google-cloud/cloudbuild");
const cb = new CloudBuildClient();

export const triggerCloudBuild = functions.https.onCall(
  async (
    data: {
      ref: {
        id: string;
        path: string;
        parentId: string;
      };
      action: "run" | "redo" | "undo";
    },
    context: functions.https.CallableContext
  ) => {
    const {
      ref, // action
    } = data;

    const authorized = hasAnyRole(["ADMIN"], context);
    if (!context.auth || !authorized) {
      console.warn(`unauthorized user${context}`);
      return {
        success: false,
        message: "you don't have permission to trigger a build",
      };
    }
    const doc = await db.doc(ref.path).get();
    const row = doc.data();
    if (!row) throw Error("No row data");
    const { triggerId, branch, projectId, groupName, functionConfig } = row;
    // Starts a build against the branch provided.
    const [resp] = await cb.runBuildTrigger({
      projectId, //project hosting cloud build
      triggerId,
      source: {
        branchName: branch,
        substitutions: {
          _PROJECT_ID: projectId,
          _FUNCTIONS_GROUP: groupName,
          _FUNCTION_CONFIG: functionConfig,
          _REQUEST_DOC_PATH: ref.path,
        },
      },
    });
    const buildId = resp.metadata.build.id;
    const logUrl = resp.metadata.build.logUrl;
    console.log({ buildId, logUrl });
    await db
      .doc(ref.path)
      .update({ buildId, logUrl, buildDuration: { start: serverTimestamp() } });
    if (buildId && logUrl) {
      return {
        message: "cloud functions are snow flakes",
        cellValue: {
          redo: true,
          status: `Triggered`,
          completedAt: serverTimestamp(),
          meta: { ranBy: context.auth.token.email },
          undo: false,
        },
        success: true,
      };
    }
    return false;
  }
);

export const cloudBuildUpdates = functions.pubsub
  .topic("cloud-builds")
  .onPublish(async (message, context) => {
    console.log(JSON.stringify(message));
    const { buildId, status } = message.attributes;
    console.log(JSON.stringify({ buildId, status }));
    //message
    //status: "SUCCESS"
    //buildId: "1a6d7819-aa35-486c-a29c-fb67eb39430f"

    const query = await db
      .collection("cloudFunctions")
      .where("buildId", "==", buildId)
      .get();

    if (query.docs.length !== 0) {
      const update = { status };
      if (status === "SUCCESS" || status === "FAILURE") {
        update["buildDuration.end"] = serverTimestamp();
      }
      await query.docs[0].ref.update(update);
    }
    return true;
  });
