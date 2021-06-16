import { db } from "./firebaseConfig";
import admin from "firebase-admin";

function firetableUser(user: admin.auth.UserRecord) {
  return {
    displayName: user?.displayName,
    email: user?.email,
    uid: user?.uid,
    emailVerified: user?.emailVerified,
    photoURL: user?.photoURL,
    timestamp: new Date(),
  };
}

async function insertErrorRecordToDB(errorRecord: object) {
  await db.collection("_FT_ERRORS").add(errorRecord);
}

function commandErrorHandler(
  meta: {
    user: admin.auth.UserRecord;
    description?: string;
    functionConfigTs?: string;
    sparksConfig?: string;
  },
  streamLogger
) {
  return async function (error, stdout, stderr) {
    await streamLogger(stdout);

    if (!error) {
      return;
    }

    const errorRecord = {
      errorType: "commandError",
      ranBy: firetableUser(meta.user),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      stdout: stdout ?? "",
      stderr: stderr ?? "",
      errorStackTrace: error?.stack ?? "",
      command: error?.cmd ?? "",
      description: meta?.description ?? "",
      functionConfigTs: meta?.functionConfigTs ?? "",
      sparksConfig: meta?.sparksConfig ?? "",
    };
    insertErrorRecordToDB(errorRecord);
  };
}

async function logErrorToDB(data: {
  errorDescription: string;
  errorExtraInfo?: string;
  errorTraceStack?: string;
  user: admin.auth.UserRecord;
  sparksConfig?: string;
}) {
  console.error(data.errorDescription);

  const errorRecord = {
    errorType: "codeError",
    ranBy: firetableUser(data.user),
    description: data.errorDescription,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    sparksConfig: data?.sparksConfig ?? "",
    errorExtraInfo: data?.errorExtraInfo ?? "",
    errorStackTrace: data?.errorTraceStack ?? "",
  };

  insertErrorRecordToDB(errorRecord);
}

function parseSparksConfig(
  sparks: string | undefined,
  user: admin.auth.UserRecord
) {
  if (sparks) {
    try {
      // remove leading "sparks.config(" and trailing ")"
      return sparks
        .replace(/^(\s*)sparks.config\(/, "")
        .replace(/\);?\s*$/, "");
    } catch (error) {
      logErrorToDB({
        errorDescription: "Sparks is not wrapped with sparks.config",
        errorTraceStack: error.stack,
        user,
        sparksConfig: sparks,
      });
    }
  }

  return "[]";
}

function createStreamLogger(
  tableConfigPath: string,
  startTimeStamp: number
  // emitFn
) {
  const fullLog: string[] = [];
  console.log("socketLogger created");

  return async (log: string) => {
    console.log(log);
    fullLog.push(log);
    await db.doc(tableConfigPath).update({
      ftBuild: {
        log,
        tableConfigPath,
        startTimeStamp,
        fullLog,
      },
    });
    // if (!emitFn) {
    //   // await logErrorToDB({
    //   //   errorDescription: `Invalid socket (${configPath})`,
    //   //   user,
    //   // });
    // } else {
    //   fullLog.push(log);
    //   emitFn("log", {
    //     log,
    //     tableConfigPath,
    //     startTimeStamp,
    //     fullLog,
    //   });
    // }
  };
}

export {
  commandErrorHandler,
  logErrorToDB,
  parseSparksConfig,
  createStreamLogger,
};
