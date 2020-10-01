#!/usr/bin/env node
const chalk = require("chalk");
const fs = require("fs");
const clear = require("clear");
const { printLogo } = require("./logo");
const terminal = require("./lib/terminal");
const inquirer = require("./lib/inquirer");
const Configstore = require("configstore");
const config = new Configstore("firetable");
const { directoryExists, findFile } = require("./lib/files");
const process = require("process");
const { Command } = require("commander");
const { version } = require("../package.json");
const { setUserRoles, getProjectTables } = require("./lib/firebaseAdmin");
const program = new Command();
program.version(version);

//TODO: validate if all the required packages exist
const systemHealthCheck = async () => {
  const versions = await terminal.getRequiredVersions();
  const requiredApps = ["node", "git", "yarn", "firebase"];

  requiredApps.forEach((app) => {
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

  Object.entries(versions).forEach(([app, version]) =>
    console.log(`${app.padEnd(8)} ${chalk.green(version)}`)
  );
};

// checks the current directory of the cli app
const directoryCheck = async () => {
  let directory = "firetable/www";
  const isInsideFiretableFolder = directoryExists("www");
  const firetableAppExists = directoryExists("firetable/www");

  if (isInsideFiretableFolder) {
    directory = "www";
  } else if (!firetableAppExists) {
    console.log(chalk.red("firetable app not detected"));
    console.log(
      `Make sure you’re in the correct directory or run ${chalk.bold(
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
  //await terminal.buildFiretable(directory);
  await terminal.setFirebaseHostingTarget(projectId, hostTarget);
  await terminal.deployToFirebaseHosting(projectId);
  config.set("firebaseHostTarget", hostTarget);

  console.log(
    chalk.green(
      `\u{1F973} ${chalk.bold("firetable has been successfully deployed to")}`
    )
  );
  console.log(`   ${chalk.underline(`https://${hostTarget}.web.app`)}`);
};

program
  .command("init [dir]")
  .description(
    "Clones firetable repo, installs npm packages, and sets required environment variables"
  )
  .action(async (dir = "firetable") => {
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
      await terminal.cloneFiretable(dir);

      // set environment variables
      await terminal.setFiretableENV(envVariables, dir);
      let firetableAppId;

      const existingFiretableAppId = await terminal.getExistingFiretableApp(
        projectId
      );

      if (existingFiretableAppId) {
        firetableAppId = existingFiretableAppId;
      } else {
        firetableAppId = await terminal.createFiretableWebApp(projectId);
      }

      const webAppConfig = await terminal.getFiretableWebAppConfig(
        firetableAppId
      );

      await terminal.createFirebaseAppConfigFile(webAppConfig, dir);
      console.log(chalk.green("Environment variables set successfully"));
      await terminal.buildFiretable(dir);
      console.log(
        chalk.green(
          chalk.bold("\n\u2705 firetable has been successfully set up at")
        )
      );
      console.log(`   ${process.cwd()}/${dir}`);

      console.log(
        "\n   Inside the firetable directory, you can now run the following commands:"
      );
      console.log(
        `   ${chalk.yellow("firetable start ")}${chalk.dim(
          "  Run your firetable instance locally"
        )}`
      );
      console.log(
        `   ${chalk.yellow("firetable deploy")}${chalk.dim(
          "  Deploy you your firetable app to Firebase Hosting"
        )}`
      );

      console.log("\n\u{1F449} You can begin by running the commands:");
      console.log(chalk.bold(chalk.yellow(`   cd ${dir}`)));
      console.log(chalk.bold(chalk.yellow(`   firetable start`)));
    } catch (error) {
      console.log("\u{1F6D1}" + chalk.bold(chalk.red(" FAILED")));
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
      // await terminal.buildFiretable(directory);
      terminal.startFiretableLocally(directory);
    } catch (error) {
      console.log("\u{1F6D1}" + chalk.bold(chalk.red(" FAILED")));
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
      console.log("\u{1F6D1}" + chalk.bold(chalk.red(" FAILED")));
      console.log(error);
    }
  });

program
  .command("auth:setRoles <email> <roles>")
  .description(
    "Adds roles to the custom claims of a specified firebase account."
  )
  .action(async (email, roles) => {
    try {
      // check directory for admin sdk json
      const projectId = config.get("firebaseProjectId")
        ? config.get("firebaseProjectId")
        : "_";

      const adminSDKFilePath = await findFile(
        /.*-firebase-adminsdk.*json/,
        `Can not find the firebase service account key json file, download the service account key for your project then add it to this directory without renaming it.\nYou can find your service account here: https://console.firebase.google.com/u/0/project/${projectId}/settings/serviceaccounts/adminsdk`
      );
      // let directory = await directoryCheck();
      // if (!directory) return;
      // await deploy2firebase(directory);
      const result = await setUserRoles(adminSDKFilePath)(
        email,
        roles.split(",")
      );
      if (result.success) {
        console.log(result.message);
        return;
      } else if (result.code === "auth/user-not-found") {
        console.log(
          chalk.bold(chalk.red("FAILED: ")),
          `could not find an account corresponding with`,
          chalk.bold(email)
        );
        return;
      } else {
        console.log(chalk.bold(chalk.red(result.message)));
        return;
      }
    } catch (error) {
      console.log("\u{1F6D1}" + chalk.bold(chalk.red(" FAILED")));
      console.log(error);
    }
  });

program
  .command("functions:deploy")
  .description("deploys a specified firetable cloud function")
  .action(async () => {
    try {
      const projectId = config.get("firebaseProjectId")
        ? config.get("firebaseProjectId")
        : "_";
      console.log({ projectId });
      // check directory for admin sdk json
      const adminSDKFilePath = await findFile(
        /.*-firebase-adminsdk.*json/,
        `Can not find the firebase service account key json file, download the service account key for your project then add it to this directory without renaming it.\nYou can find your service account here: https://console.firebase.google.com/u/0/project/${projectId}/settings/serviceaccounts/adminsdk`
      );

      var serviceAccount = fs.readFileSync(adminSDKFilePath, {
        encoding: "utf8",
      });
      fs.writeFileSync(
        `./cloud_functions/functions/firebase-credentials.json`,
        serviceAccount
      );

      const { functionToDeploy } = await inquirer.firetableFunctions();
      if (["actionScript", "webhooks"].includes(functionToDeploy)) {
        // used for non-collection specific functions
        await terminal.deployCloudFunction(projectId, functionToDeploy);
      } else {
        const collections = (await getProjectTables(adminSDKFilePath)()).map(
          (f) => f.collection
        );
        const { targetCollection } = await inquirer.selectTableCollection(
          collections
        );
        await terminal.createCloudFunctionConfig(
          functionToDeploy,
          targetCollection
        );
        await terminal.deployCloudFunction(projectId, functionToDeploy);
      }
      console.log(
        "Success!\nYou can now check the firebase cloud functions dashboard to confirm that your function has been deployed successfully!"
      );
    } catch (error) {
      console.log("\u{1F6D1}" + chalk.bold(chalk.red(" FAILED")));
      console.log(error);
    }
  });

program.parse(process.argv);
