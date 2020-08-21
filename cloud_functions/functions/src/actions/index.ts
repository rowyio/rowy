import * as functions from "firebase-functions";
import * as _ from "lodash";
import * as admin from "firebase-admin";

import { hasAnyRole } from "../utils/auth";
import config from "../functionConfig"; // generated using generateConfig.ts

type ActionData = {
  ref: {
    id: string;
    path: string;
    parentId: string;
  };
  row: any;
  column: any;
  action: "run" | "redo" | "undo";
};

type ActionScript = (
  data: ActionData,
  context: functions.https.CallableContext
) => {
  message: string;
  redo: boolean;
  undo: boolean;
  status: string;
  success: Boolean;
};
const functionConfig: {
  AllowedRoles: string[];
  functionName: string;
  actionScripts: {
    run: ActionScript;
    undo: ActionScript;
    redo: ActionScript;
  };
} = config as any;

const { AllowedRoles, functionName, actionScripts } = functionConfig;
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

const actionCallable = async (
  data: ActionData,
  context: functions.https.CallableContext
) => {
  const authorized =
    AllowedRoles && AllowedRoles.length !== 0
      ? hasAnyRole(AllowedRoles, context)
      : true;

  if (!context.auth || !authorized) {
    console.warn(`unauthorized user ${context}`);
    return {
      success: false,
      message: "you don't have permissions to preform this action",
    };
  }
  const result = actionScripts[data.action](data, context);
  return {
    message: result.message,
    cellValue: {
      redo: result.redo,
      status: result.status,
      completedAt: serverTimestamp(),
      ranBy: context.auth.uid,
      undo: result.undo,
    },
    success: result.success,
  };
};

export const FT_actions = {
  [functionName]: functions.https.onCall(actionCallable),
};
