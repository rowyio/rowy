import { addPackages, addSparkLib } from "./terminal";
const fs = require("fs");
import { generateConfigFromTableSchema } from "./loader";
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
  await Promise.all(requiredSparks.map((s) => addSparkLib(s)));
});
