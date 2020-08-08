#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const clear = require("clear");
const files = require("./lib/files");
const github = require("./lib/github");

const cmds = require("./lib/cmd.js");
const Configstore = require("configstore");
const conf = new Configstore("firetable");
const { logo } = require("./logo");
// The path can be either a local path or an url

clear();
console.log(chalk.red(logo));
console.log(
  chalk.white(
    figlet.textSync("FIRETABLE", {
      font: "rounded",
      horizontalLayout: "full",
    })
  )
);

const inquirer = require("./lib/inquirer");

const run = async () => {
  const versions = await cmds.getRequiredVersions();
  console.log(versions);

  const firebaseProjects = await cmds.getFirebaseProjects();

  const firebaseProject = await inquirer.selectFirebaseProject(
    firebaseProjects
  );
  let envVariables = {
    ...firebaseProject,

    algoliaAppId: "_",
    algoliaSearchKey: "_",
  };
  const includeAlgolia = await inquirer.installAlgolia();
  if (includeAlgolia.installAlgolia) {
    const algoliaKey = await inquirer.askAlgoliaVariables();
    envVariables = { ...envVariables, ...algoliaKey };
  }
  console.log(envVariables);

  await cmds.cloneFiretable();

  await cmds.setFiretableENV(envVariables);

  const firetableAppId = await cmds.createFiretableWebApp(
    firebaseProject.projectId
  );
  console.log(firetableAppId);

  const webAppConfig = await cmds.getFiretableWebAppConfig(firetableAppId);

  await cmds.createFirebaseAppConfigFile(webAppConfig);
  console.log(chalk.green(webAppConfig));

  console.log(chalk.green("environment variables were set successfully"));
  await cmds.buildFiretable();
  const deployToFirebaseHosting = await inquirer.deployToFirebaseHosting();

  if (deployToFirebaseHosting.deployToFirebase) {
    const hostingTarget = await inquirer.askFirebaseHostTarget(
      firebaseProject.projectId
    );
    await cmds.setFirebaseHostingTarget(
      firebaseProject.projectId,
      hostingTarget.hostTarget
    );
    console.log(hostingTarget);
    await cmds.deployToFirebaseHosting(firebaseProject.projectId);

    console.log(
      chalk.green(
        `\u{1F973}\u{1F973}\u{1F973} \n Firetable has been successfully deployed to https://${hostingTarget.hostTarget}.web.app \n {1F973}\u{1F973}\u{1F973}`
      )
    );
  }
  // await cmds.startFiretableLocally();
};

run();
