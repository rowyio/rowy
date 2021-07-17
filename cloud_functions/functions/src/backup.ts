import * as functions from "firebase-functions";
import * as firestore from "@google-cloud/firestore";
import { hasAnyRole } from "./utils/auth";

const client = new firestore.v1.FirestoreAdminClient();

// Replace BUCKET_NAME
const bucket = "gs://BUCKET_NAME";
/*
const restoreFirestoreBackup = (collectionIds: string[] = []) => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, "(default)");
  const date = new Date();

  const backupFolder = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const inputUriPrefix = bucket + "/" + backupFolder;
  console.log(inputUriPrefix);
  return client
    .importDocuments({
      name: databaseName,
      inputUriPrefix,
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds,
    })
    .then((responses) => {
      const response = responses[0];
      console.log(`Operation Name: ${response["name"]}`);
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw new Error("import operation failed");
    });
};

export const scheduledFirestoreImport = functions.pubsub
  .schedule("every 24 hours")
  .onRun((context) => {
    console.log(context);
    return restoreFirestoreBackup();
  });
  */

const firestoreBackup = (collectionIds: string[] = []) => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId ?? "", "(default)");
  const date = new Date();

  const backupFolder = `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}-${date.getUTCHours()}`;

  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket + "/" + backupFolder,
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds,
    })
    .then((responses) => {
      const response = responses[0];
      console.log(`Operation Name: ${response["name"]}`);
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Export operation failed");
    });
};
export const scheduledFirestoreBackup = functions.pubsub
  .schedule("every 12 hours")
  .onRun((context) => {
    console.log(context);
    return firestoreBackup();
  });

export const callableFirestoreBackup = functions.https.onCall(
  async (data, context) => {
    console.log(data);
    const authorized = hasAnyRole(["ADMIN"], context);
    if (!context.auth || !authorized) {
      console.warn(`unauthorized user${context}`);
      return {
        success: false,
        message: "you don't have permissions to send this email",
      };
    } else {
      await firestoreBackup();
      return {
        success: true,
        message: "backup ran",
      };
    }
  }
);
