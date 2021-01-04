import { addPackages, addSparkLib } from "./terminal";
const fs = require("fs");
import { generateConfigFromTableSchema } from "./loader";

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

generateConfigFromTableSchema(process.argv[2]).then(async () => {
  const configFile = fs.readFileSync(
    "../functions/src/functionConfig.ts",
    "utf-8"
  );
  const requiredDependencies = configFile.match(
    /(?<=(require\(("|'))).*?(?=("|')\))/g
  );
  if (requiredDependencies) {
    await addPackages(requiredDependencies.map((p) => ({ name: p })));
  }

  const { sparksConfig } = require("../functions/src/functionConfig");
  const requiredSparks = sparksConfig.map((s) => s.type);
  console.log({ requiredSparks });

  await asyncForEach(requiredSparks, async (s) => await addSparkLib(s));
});
