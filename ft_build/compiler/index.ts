import { addPackages, addSparkLib, asyncExecute } from "./terminal";
const fs = require("fs");
import { generateConfigFromTableSchema } from "./loader";
import { commandErrorHandler } from "../utils";
const path = require("path");
import admin from "firebase-admin";

export default async function generateConfig(
  schemaPath: string,
  user: admin.auth.UserRecord,
  streamLogger
) {
  return await generateConfigFromTableSchema(
    schemaPath,
    user,
    streamLogger
  ).then(async (success) => {
    if (!success) {
      await streamLogger.info(
        `generateConfigFromTableSchema failed to complete`
      );
      return false;
    }

    await streamLogger.info(`generateConfigFromTableSchema done`);
    const configFile = fs.readFileSync(
      path.resolve(__dirname, "../functions/src/functionConfig.ts"),
      "utf-8"
    );
    await streamLogger.info(`configFile: ${JSON.stringify(configFile)}`);
    const requiredDependencies = configFile.match(
      /(?<=(require\(("|'))).*?(?=("|')\))/g
    );
    if (requiredDependencies) {
      const packgesAdded = await addPackages(
        requiredDependencies.map((p: any) => ({ name: p })),
        user,
        streamLogger
      );
      if (!packgesAdded) {
        return false;
      }
    }
    await streamLogger.info(
      `requiredDependencies: ${JSON.stringify(requiredDependencies)}`
    );

    const isFunctionConfigValid = await asyncExecute(
      "cd build/functions/src; tsc functionConfig.ts",
      commandErrorHandler(
        {
          user,
          functionConfigTs: configFile,
          description: `Invalid compiled functionConfig.ts`,
        },
        streamLogger
      )
    );
    await streamLogger.info(
      `isFunctionConfigValid: ${JSON.stringify(isFunctionConfigValid)}`
    );
    if (!isFunctionConfigValid) {
      return false;
    }

    const { sparksConfig } = require("../functions/src/functionConfig.js");
    const requiredSparks = sparksConfig.map((s: any) => s.type);
    await streamLogger.info(
      `requiredSparks: ${JSON.stringify(requiredSparks)}`
    );

    for (const lib of requiredSparks) {
      const success = await addSparkLib(lib, user, streamLogger);
      if (!success) {
        return false;
      }
    }
    return true;
  });
}
