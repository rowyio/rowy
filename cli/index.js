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
          `Your system is missing ${app}\nPlease install ${app}, then re-run ${chalk.bold(
            chalk.yellow("firetable init")
          )}`
        )
      );
    }
  });

  console.log(versions);
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
    console.log(chalk.red("firetable app not detected"));
    console.log(
      `Make sure you’re in the correct directory or run:${chalk.bold(
        chalk.yellow("firetable init")
      )} to get started`
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
      `\u{1F973}\nfiretable has been successfully deployed to ${chalk.underline(
        `https://${hostTarget}.web.app`
      )}`
    )
  );
};

program
  .command("init")
  .description(
    "Clones firetable repo, installs npm packages, and sets required environment variables"
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

      console.log(chalk.green("Environment variables set successfully"));
      console.log(
        chalk.green(chalk.bold("\nfiretable has been successfully set up!"))
      );

      console.log("\nYou can now run the following commands:");

      console.log(
        `${chalk.bold(
          chalk.yellow("firetable start")
        )}    Run your firetable instance locally`
      );

      console.log(
        `${chalk.bold(
          chalk.yellow("firetable deploy")
        )}   Deploy you your firetable app to Firebase Hosting`
      );
    } catch (error) {
      console.log(chalk.red("FAILED:"));
      console.log(error);
    }
  });

program
  .command("start")
  .description("Runs your firetable instance locally")
  .action(async () => {
    try {
      // check directory for firetable
      let directory = await directoryCheck();
      if (!directory) return;
      await terminal.buildFiretable(directory);
      terminal.startFiretableLocally(directory);
    } catch (error) {
      console.log(chalk.red("FAILED:"));
      console.log(error);
    }
  });

program
  .command("deploy")
  .description("Deploys firetable to a Firebase Hosting site")
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
