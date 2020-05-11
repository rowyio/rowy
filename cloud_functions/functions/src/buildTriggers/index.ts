import * as functions from "firebase-functions";
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
      row: any;
      action: "run" | "redo" | "undo";
    },
    context: functions.https.CallableContext
  ) => {
    const {
      row, //ref, action
    } = data;

    if (!context.auth) {
      return false;
    }
    const { triggerId, branch, projectId, groupName } = row;

    // Starts a build against the branch provided.
    const [resp] = await cb.runBuildTrigger({
      projectId, //project hosting cloud build
      triggerId,
      source: {
        branchName: branch,
        substitutions: {
          _PROJECT_ID: projectId,
          _FUNCTIONS_GROUP: groupName,
        },
      },
    });
    console.info(`triggered build for ${triggerId}`);
    const [build] = await resp.promise();

    const STATUS_LOOKUP = [
      "UNKNOWN",
      "Queued",
      "Working",
      "Success",
      "Failure",
      "Error",
      "Timeout",
      "Cancelled",
    ];
    for (const step of build.steps) {
      console.info(
        `step:\n\tname: ${step.name}\n\tstatus: ${STATUS_LOOKUP[build.status]}`
      );
    }

    console.log(context.auth.token);
    if (triggerId) {
      return {
        message: "cloud functions are snow flakes",
        cellValue: {
          redo: true,
          status: `Triggered`,
          // completedAt: serverTimestamp(),
          meta: { ranBy: context.auth.token.email },
          undo: false,
        },
        success: true,
      };
    }
    return false;
  }
);
