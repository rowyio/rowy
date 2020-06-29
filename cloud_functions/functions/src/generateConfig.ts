const fs = require("fs");

const main = configString => {
  fs.writeFileSync("./src/functionConfig.ts", configString);
};

main(process.argv[2]);
