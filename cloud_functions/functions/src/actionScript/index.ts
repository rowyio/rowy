import * as functions from "firebase-functions";
import * as _ from "lodash";
import { db, auth } from "../config";
import * as admin from "firebase-admin";
import utilFns from "../utils";
type ActionData = {
  ref: {
    id: string;
    path: string;
    parentId: string;
    tablePath: string;
  };
  row: any;
  column: any;
  action: "run" | "redo" | "undo";
};
// import {
//   serverTimestamp,
//   makeId,
//   hasGoogleMailServer,
//   hasMissingFields,
// } from "../utils";

import { hasAnyRole } from "../utils/auth";

const generateSchemaDocPath = tablePath => {
  const pathComponents = tablePath.split("/");
  return `_FIRETABLE_/settings/${
    pathComponents[1] === "table" ? "schema" : "groupSchema"
  }/${pathComponents[2]}`;
};
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

export const actionScript = functions.https.onCall(
  async (data: ActionData, context: functions.https.CallableContext) => {
    try {
      if (!context || !hasAnyRole(["ADMIN", "OPS", "PROGRAM"], context))
        throw Error(`You don't have permissions to drop out founders`);

      const { ref, row, column } = data;

      const schemaDocPath = generateSchemaDocPath(ref.tablePath);

      const schemaDoc = await db.doc(schemaDocPath).get();
      const schemaDocData = schemaDoc.data();
      if (!schemaDocData) {
        return {
          success: false,

          message: "no schema found",
        };
      }
      const script = schemaDocData.columns[column.key].config.script;

      // get auth
      console.log(JSON.stringify({ row, ref, column, schemaDocData, script }));

      const result: {
        message: string;
        status: string;
        success: boolean;
      } = await eval(`async({db, auth, utilFns})=>{${script}}`)({
        db,
        auth,
        utilFns,
      });
      return {
        success: result.success,
        message: result.message,
        cellValue: {
          redo: true,
          status: result.status,
          completedAt: serverTimestamp(),
          meta: { ranBy: context.auth!.token.email },
          undo: false,
        },
        undo: false,
        redo: false,
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
