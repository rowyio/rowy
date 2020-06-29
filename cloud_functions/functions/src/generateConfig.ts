const fs = require("fs");

const main = configString => {
  const data = fs.readFileSync("./src/functionConfig.ts");
  console.log(`previous config`, data.toString());
  fs.writeFileSync("./src/functionConfig.ts", configString);
};

main(process.argv[2]);
