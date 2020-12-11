import * as child from "child_process";

function execute(command, callback) {
  child.exec(command, function (error, stdout, stderr) {
    console.log({ error, stdout, stderr });
    callback(stdout);
  });
}

export const addPackages = (packages: { name: string; version?: string }[]) => {
  //const command =`cd FT_functions/functions;yarn add ${packageName}@${version}`
  const command = `cd ../functions;yarn add ${packages.reduce(
    (acc, currPackage) => {
      return `${acc} ${currPackage.name}@${currPackage.version ?? "latest"}`;
    },
    ""
  )}`;
  console.log(command);
  execute(command, function () {});
};
