import * as functions from "firebase-functions";
import * as _ from "lodash";
import { db, auth } from "./firebaseConfig";
import * as admin from "firebase-admin";
import utilFns from "./utils";
type ActionData = {
  ref: {
    id: string;
    path: string;
    parentId: string;
    tablePath: string;
  };
  schemaDocPath?: string;
  column: any;
  action: "run" | "redo" | "undo";
  actionParams: any;
};

const missingFieldsReducer = (data: any) => (acc: string[], curr: string) => {
  if (data[curr] === undefined) {
    return [...acc, curr];
  } else return acc;
};

const generateSchemaDocPath = (tablePath) => {
  const pathComponents = tablePath.split("/");
  return `_FIRETABLE_/settings/${
    pathComponents[1] === "table" ? "schema" : "groupSchema"
  }/${pathComponents[2]}`;
};
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

export const actionScript = functions.https.onCall(
  async (data: ActionData, context: functions.https.CallableContext) => {
    try {
      if (!context) {
        throw Error(`You are unauthenticated`);
      }

      const { ref, actionParams, column, action, schemaDocPath } = data;
      const _schemaDocPath =
        schemaDocPath ?? generateSchemaDocPath(ref.tablePath);
      const [schemaDoc, rowQuery] = await Promise.all([
        db.doc(_schemaDocPath).get(),
        db.doc(ref.path).get(),
      ]);
      const row = rowQuery.data();
      const schemaDocData = schemaDoc.data();
      if (!schemaDocData) {
        return {
          success: false,
          message: "no schema found",
        };
      }
      const config = schemaDocData.columns[column.key].config;
      const { script, requiredRoles, requiredFields } = config;
      if (!requiredRoles || requiredRoles.length === 0) {
        throw Error(`You need to specify at least one role to run this script`);
      }
      if (!utilFns.hasAnyRole(requiredRoles, context)) {
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
      const result: {
        message: string;
        status: string;
        success: boolean;
      } = await eval(
        `async({row,db, ref,auth,utilFns,actionParams,context})=>{${
          action === "undo" ? config["undo.script"] : script
        }}`
      )({ row, db, auth, utilFns, ref, actionParams, context });
      if (result.success){
          const cellValue = {
            redo: config["redo.enabled"],
            status: result.status,
            completedAt: serverTimestamp(),
            ranBy: context.auth!.token.email,
            undo: config["undo.enabled"],
          }
          const userDoc = await db.collection("_FT_USERS").doc(context.auth!.uid).get()
          const user = userDoc?.get('user')
         await db.doc(ref.path).update({[column.key]:cellValue, _ft_updatedBy:user? {  
        ...user,
          ...context.auth!,
          timestamp: new Date(),
        }:null })
          return {
            ...result,
            cellValue,
          }
      }  
      else return {
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
