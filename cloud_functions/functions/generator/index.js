const fs = require("fs");
const mapsSchema = require("./mapsSchema.json");
const claimsSchema = require("./claimsSchema.json");
const OutputPath = "../src/maps.ts";
const templatePath = "./templates/maps.ts";
const placeHolder = "/*<GENERATED_CODE>*/";
const TEMPLATE_KEYS = {
  body: "/*<GENERATED_CODE>*/",
  subscriptionCollectionPath: /<<COLLECTION_PATH>>/gi,
  triggerEvent: /<<TRIGGER_EVENT>>/gi,
  targetDocPath: /<<TARGET_DOC_PATH>>/gi,
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

const maps = async () => {
  let templateCode = await readFile(templatePath);
  output = templateCode.replace(
    TEMPLATE_KEYS.subscriptionCollectionPath,
    mapsSchema.subscription
  );
  output = output.replace(TEMPLATE_KEYS.triggerEvent, "onUpdate");
  output = output.replace(TEMPLATE_KEYS.targetDocPath, "founder[0].docPath");
  const tasks = mapsSchema.targets.map(target => {
    const fields = target.map.map(field => {
      return `${field.toField}:afterData.${field.fromField}`;
    });
    return `const updates = {${fields.join()}}`;
  });

  output = output.replace(TEMPLATE_KEYS.body, tasks.join());
  writeFile(OutputPath, output);
};
maps();
