const fs = require("fs");

const main = configString => {
  fs.writeFileSync("./src/functionConfig.json", configString);
};

main(process.argv[2]);
