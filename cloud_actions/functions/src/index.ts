import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as request from "request";
import * as functions from "firebase-functions";
import { db, auth } from "./config";
import * as admin from "firebase-admin";
import utilFns from "./utils";
type ActionData = {
  ref: {
    id: string;
    path: string;
    parentId: string;
    tablePath: string;
  };
  schemaDocPath: string;
  row: any;
  column: any;
  action: "run" | "redo" | "undo";
  actionParams: any;
};
// import {
//   makeId,
//   hasGoogleMailServer,
//   hasMissingFields,
// } from "../utils";

import { hasAnyRole } from "./utils/auth";

const missingFieldsReducer = (data: any) => (acc: string[], curr: string) => {
  if (data[curr] === undefined) {
    return [...acc, curr];
  } else return acc;
};

// const generateSchemaDocPath = (tablePath:string) => {
//   const pathComponents = tablePath.split("/");
//   return `_FIRETABLE_/settings/${
//     pathComponents[1] === "table" ? "schema" : "groupSchema"
//   }/${pathComponents[2]}`;
// };

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

const scriptLoader = (uri: string, file: fs.WriteStream) =>
  new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri,
    })
      .pipe(file)
      .on("finish", () => {
        console.log(`The file is finished downloading.`);
        resolve();
      })
      .on("error", (error: any) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`Something happened: ${error}`);
  });

export const actionScript = functions.https.onCall(
  async (data: ActionData, context: functions.https.CallableContext) => {
    try {
      if (!context) {
        throw Error(`You are unauthenticated`);
      }

      const { ref, actionParams, row, column, action, schemaDocPath } = data;

      const schemaDoc = await db.doc(schemaDocPath).get();
      const schemaDocData = schemaDoc.data();
      if (!schemaDocData) {
        return {
          success: false,
          message: "no schema found",
        };
      }
      const config = schemaDocData.columns[column.key].config;
      const { requiredRoles, requiredFields } = config;
      if (!hasAnyRole(requiredRoles, context)) {
        throw Error(`You don't have the required roles permissions`);
      }

      const missingRequiredFields = requiredFields
        ? requiredFields.reduce(missingFieldsReducer(row), [])
        : [];
      if (missingRequiredFields.length > 0) {
        throw new Error(
          `Missing required fields:${missingRequiredFields.join(", ")}`
        );
      }
      //
      // get auth

      const scriptSource: string =
        "https://gist.githubusercontent.com/shamsmosowi/3a0a93aec9faa0edba55fa228a9f9495/raw/3ffb8ed3a118caf0dd8140254794f523fa370cdd/sript.js";
      const filePath = "script.js";
      const baseFileName = path.basename(filePath, path.extname(filePath));
      const scriptLocation = path.join(
        os.tmpdir(),
        baseFileName + path.extname(filePath)
      );
      const file = fs.createWriteStream(scriptLocation);
      await scriptLoader(scriptSource, file);
      const loadedScript: any = await import(scriptLocation);
      const {
        cloudActionScript,
      }: { cloudActionScript: Function } = loadedScript;

      const result: {
        message: string;
        status: string;
        success: boolean;
      } = await cloudActionScript({
        row,
        db,
        ref,
        auth,
        utilFns,
        actionParams,
        context,
      });

      if (result.success)
        return {
          success: result.success,
          message: result.message,
          cellValue: {
            redo: config["redo.enabled"],
            status: result.status,
            completedAt: serverTimestamp(),
            meta: { ranBy: context.auth!.token.email },
            undo: action !== "undo" && config["undo.enabled"],
          },
          undo: config["undo.enabled"],
          redo: config["redo.enabled"],
        };
      else
        return {
          success: false,
          message: result.message,
        };
    } catch (error) {
      return {
        success: false,
        error,
        message: error.message,
      };
    }
  }
);
