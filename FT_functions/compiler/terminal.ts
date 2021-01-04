import * as child from "child_process";

function execute(command, callback) {
  child.exec(command, function (error, stdout, stderr) {
    console.log({ error, stdout, stderr });
    callback(stdout);
  });
}

export const addPackages = (packages: { name: string; version?: string }[]) =>
  new Promise((resolve, reject) => {
    //const command =`cd FT_functions/functions;yarn add ${packageName}@${version}`
    const packagesString = packages.reduce((acc, currPackage) => {
      return `${acc} ${currPackage.name}@${currPackage.version ?? "latest"}`;
    }, "");
    if (packagesString.trim().length !== 0) {
      execute("ls", function () {});

      const command = `cd ../functions;yarn add ${packagesString}`;
      console.log(command);
      execute(command, function () {
        resolve(true);
      });
    } else resolve(false);
  });

export const addSparkLib = (name: string) =>
  new Promise(async (resolve, reject) => {
    const { dependencies } = require(`../sparksLib/${name}`);
    const packages = Object.keys(dependencies).map((key) => ({
      name: key,
      version: dependencies[key],
    }));
    await addPackages(packages);
    const command = `cp ../sparksLib/${name}.ts ../functions/src/sparks/${name}.ts`;
    execute(command, function () {
      resolve(true);
    });
  });
