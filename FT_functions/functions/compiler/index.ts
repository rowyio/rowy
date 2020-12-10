import { addPackages } from "./terminal";
const fs = require("fs");
import { generateConfigFromTableSchema } from "./loader";

generateConfigFromTableSchema("/_FIRETABLE_/settings/schema/portfolio").then(
  () => {
    const configFile = fs.readFileSync("./src/functionConfig.ts", "utf-8");
    const requiredDependencies = configFile.match(
      /(?<=(require\(("|'))).*?(?=("|')\))/g
    );

    console.log(requiredDependencies);
    if (requiredDependencies) {
      addPackages(requiredDependencies.map((p) => ({ name: p })));
    }
  }
);

//addPackage('algoliasearch')
