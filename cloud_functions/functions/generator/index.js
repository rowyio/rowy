const fs = require("fs");
const schema = require("./schema.json");
const OutputPath = "../src/maps.ts";
const templatePath = "./templates/maps.ts";
const placeHolder = "/*<GENERATED_CODE>*/";
const TEMPLATE_KEYS = {
  body: "/*<GENERATED_CODE>*/",
  subscriptionCollectionPath: /<<COLLECTION_PATH>>/gi,
  triggerEvent: /<<TRIGGER_EVENT>>/gi,
};
// fs.readFile(OutputPath, "utf-8", (err, data) => {
// fs.writeFile(OutputPath, data + generatedCode, err => {
//   if (err) console.log(err);
//   console.log("Successfully Written to File.");
// });
// });
const readFile = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function(err, data) {
      if (err) {
        reject("err");
      }
      resolve(data);
    });
  });
};
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
  console.log(schema);
  let templateCode = await readFile(templatePath);
  output = templateCode.replace(
    TEMPLATE_KEYS.subscriptionCollectionPath,
    schema.subscription
  );
  output = templateCode.replace(TEMPLATE_KEYS.triggerEvent, "onUpdate");
  const tasks = schema.targets.map(target => {});
  output = output.replace(TEMPLATE_KEYS.body, "tasks.push({})");
  writeFile(OutputPath, output);
};
main();
