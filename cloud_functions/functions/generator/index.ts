const fs = require("fs");
const OutputPath = "../src/maps.ts";
const templatePath = "./templates/maps.ts";

// fs.readFile(OutputPath, "utf-8", (err, data) => {
// fs.writeFile(OutputPath, data + generatedCode, err => {
//   if (err) console.log(err);
//   console.log("Successfully Written to File.");
// });
// });
async function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
async function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(OutputPath, data, err => {
      if (err) reject(err);
      resolve(true);
      console.log("Successfully Written to File.");
    });
  });
}

const main = async () => {
  const templateCode = await readFile(templatePath);
  writeFile(OutputPath, templateCode);
};
main();
