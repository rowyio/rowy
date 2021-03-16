import { addPackages, addSparkLib, asyncExecute } from "./terminal";
const fs = require("fs");
import { generateConfigFromTableSchema } from "./loader";
import { commandErrorHandler } from "../utils";
const path = require("path");
import admin from "firebase-admin";

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

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
        await addPackages(requiredDependencies.map((p: any) => ({ name: p })));
      }

      await asyncExecute(
        "cd build/functions/src; tsc functionConfig.ts",
        commandErrorHandler({ user })
      );

      const { sparksConfig } = require("../functions/src/functionConfig.js");
      const requiredSparks = sparksConfig.map((s: any) => s.type);
      console.log({ requiredSparks });

      await asyncForEach(
        requiredSparks,
        async (s: any) => await addSparkLib(s)
      );

      return true;
    }
  );
}
