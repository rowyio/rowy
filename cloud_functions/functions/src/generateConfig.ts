const fs = require("fs");

const main = configString => {
  fs.writeFileSync("./src/functionConfig.ts", `export default ${configString}`);
};

main(process.argv[2]);
