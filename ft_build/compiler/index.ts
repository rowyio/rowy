import { addPackages, addSparkLib, asyncExecute } from "./terminal";
const fs = require("fs");
import { generateConfigFromTableSchema } from "./loader";
import { commandErrorHandler } from "../utils";
const path = require("path");
import admin from "firebase-admin";

export default async function generateConfig(
  schemaPath: string,
  user: admin.auth.UserRecord
) {
  return await generateConfigFromTableSchema(schemaPath, user).then(
    async (success) => {
      if (!success) {
        console.log("generateConfigFromTableSchema failed to complete");
        return false;
      }

      console.log("generateConfigFromTableSchema done");
      const configFile = fs.readFileSync(
        path.resolve(__dirname, "../functions/src/functionConfig.ts"),
        "utf-8"
      );
      const requiredDependencies = configFile.match(
        /(?<=(require\(("|'))).*?(?=("|')\))/g
      );
      if (requiredDependencies) {
        const packgesAdded = await addPackages(
          requiredDependencies.map((p: any) => ({ name: p })),
          user
        );
        if (!packgesAdded) {
          return false;
        }
      }

      const isFunctionConfigValid = await asyncExecute(
        "cd build/functions/src; tsc functionConfig.ts",
        commandErrorHandler({
          user,
          functionConfigTs: configFile,
          description: `Invalid compiled functionConfig.ts`,
        })
      );
      if (!isFunctionConfigValid) {
        return false;
      }

      const { sparksConfig } = require("../functions/src/functionConfig.js");
      const requiredSparks = sparksConfig.map((s: any) => s.type);
      console.log({ requiredSparks });

      for (const lib of requiredSparks) {
        const success = await addSparkLib(lib, user);
        if (!success) {
          return false;
        }
      }

      return true;
    }
  );
}
