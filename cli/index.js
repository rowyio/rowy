#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const { printLogo } = require("./logo");
const { Command } = require("commander");
const terminal = require("./lib/terminal");
const inquirer = require("./lib/inquirer");
const Configstore = require("configstore");
const config = new Configstore("firetable");
const { directoryExists } = require("./lib/files");
const program = new Command();
program.version("0.4.0");

//TODO: validate if all the required packages exist
const systemHealthCheck = async () => {
  const versions = await terminal.getRequiredVersions();
  const requiredApps = ["node", "git", "yarn", "firebase"];
  requiredApps.forEach(app => {
    if (versions[app] === "") {
      throw new Error(
        chalk.red(
          `your system is missing ${app}\n please install ${app}, then rerun firetable init`
        )
      );
    }
  });
  console.log(versions);
  //
};
// checks the current directory of the cli app
const directoryCheck = async () => {
  let directory = "firetable/www";
  const isInsideFiretableFolder = directoryExists("www");
  const firetableAppExists = directoryExists("firetable/www");
  if (isInsideFiretableFolder) {
    directory = "www";
  }
  if (!isInsideFiretableFolder && !firetableAppExists) {
    console.log(chalk.red("Firetable app not detected."));
    console.log(
      `please ensure you are in the correct directory or run:${chalk.bold(
        chalk.yellow("firetable init")
      )} to get  started`
    );
    return;
  }
  const nodeModulesAvailable = directoryExists(`${directory}/node_modules`);
  if (!nodeModulesAvailable) {
    await terminal.installFiretableAppPackages(directory);
  }
  return directory;
};

const deploy2firebase = async (directory = "firetable/www") => {
  const projectId = config.get("firebaseProjectId");
  let hostTarget = config.get("firebaseHostTarget");
  if (hostTarget) {
    const { changeTarget } = await inquirer.askChangeFirebaseHostTarget(
      hostTarget
    );
    if (changeTarget) {
      const response = await inquirer.askFirebaseHostTarget(projectId);
      hostTarget = response.hostTarget;
    }
  } else {
    const response = await inquirer.askFirebaseHostTarget(projectId);
    hostTarget = response.hostTarget;
  }
  await terminal.buildFiretable(directory);
  await terminal.setFirebaseHostingTarget(projectId, hostTarget, directory);
  await terminal.deployToFirebaseHosting(projectId, directory);
  config.set("firebaseHostTarget", hostTarget);
  console.log(
    chalk.green(
      `\u{1F973}\u{1F973}\u{1F973} \n Firetable has been successfully deployed to 'https://${hostTarget}.web.app' \n \u{1F973}\u{1F973}\u{1F973}`
    )
  );
};

program
  .command("init")
  .description(
    "clones firetable repo, installs the npm packages and set the environment variables"
  )
  .action(async () => {
    try {
      clear();
      printLogo();
      // check if all the required packages are available on the machine
      await systemHealthCheck();
      const firebaseProjects = await terminal.getFirebaseProjects();

      const { projectId } = await inquirer.selectFirebaseProject(
        firebaseProjects
      );
      config.set("firebaseProjectId", projectId);
      let envVariables = {
        projectId,
        firebaseWebApiKey: "-",
        algoliaAppId: "_",
        algoliaSearchKey: "_",
      };
      const includeAlgolia = await inquirer.installAlgolia();
      if (includeAlgolia.installAlgolia) {
        const algoliaKey = await inquirer.askAlgoliaVariables();
        envVariables = { ...envVariables, ...algoliaKey };
      }
      // clone firetable repo and install app dependencies
      await terminal.cloneFiretable();

      // set environment variables
      await terminal.setFiretableENV(envVariables);
      let firetableAppId;

      const existingFiretableAppId = await terminal.getExistingFiretableApp(
        projectId
      );

      // TODO: SET FIREBASE PROJECT

      if (existingFiretableAppId) {
        firetableAppId = existingFiretableAppId;
      } else {
        firetableAppId = await terminal.createFiretableWebApp(projectId);
      }

      const webAppConfig = await terminal.getFiretableWebAppConfig(
        firetableAppId
      );

      await terminal.createFirebaseAppConfigFile(webAppConfig);

      console.log(chalk.green("environment variables were set successfully"));
      console.log(
        chalk.green("Success: Firetable has been successfully set up!")
      );
      console.log(
        `you can run:${chalk.bold(
          "firetable local"
        )} command to run your firetable instance locally`
      );
      console.log(
        `you can run:${chalk.bold(
          "firetable deploy"
        )} to deploy you your firetable app to firebase hosting`
      );
    } catch (error) {
      console.log(chalk.red("FAILED:"));
      console.log(error);
    }
  });

program
  .command("local")
  .description("run your firetable instance locally")
  .action(async () => {
    try {
      // check directory for firetable
      let directory = await directoryCheck();
      if (!directory) return;
      terminal.startFiretableLocally(directory);
    } catch (error) {
      console.log(chalk.red("FAILED:"));
      console.log(error);
    }
  });

program
  .command("deploy")
  .description("deploys firetable to a firebase hosting site")
  .action(async () => {
    try {
      // check directory for firetable
      let directory = await directoryCheck();
      if (!directory) return;
      await deploy2firebase(directory);
    } catch (error) {
      console.log(chalk.red("FAILED:"));
      console.log(error);
    }
  });
program.parse(process.argv);
