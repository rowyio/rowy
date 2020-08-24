var exec = require("child_process").exec;
const CLI = require("clui");
const Spinner = CLI.Spinner;
// appId regex \d:[0-9]*:web:[0-z]*

// firetable app Regex │ firetable-app.*
function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    //console.log({ error, stdout, stderr });
    callback(stdout);
  });
}

module.exports.getRequiredVersions = () =>
  new Promise(resolve => {
    const checkingVersionsStatus = new Spinner(
      "Checking the versions of required system packages"
    );

    checkingVersionsStatus.start();

    execute("git --version", function(git) {
      execute("node --version", function(node) {
        execute("yarn --version", function(yarn) {
          execute("firebase --version", function(firebase) {
            checkingVersionsStatus.stop();
            resolve({
              node: node ? node.match(/[0-9]*\.[0-9]*\.[0-9]/)[0] : "",
              git: git ? git.match(/[0-9]*\.[0-9]*\.[0-9]/)[0] : "",
              yarn: yarn ? yarn.match(/[0-9]*\.[0-9]*\.[0-9]/)[0] : "",
              firebase: firebase
                ? firebase.match(/[0-9]*\.[0-9]*\.[0-9]/)[0]
                : "",
            });
          });
        });
      });
    });
  });

module.exports.getGitUser = function(callback) {
  execute("git config --global user.name", function(name) {
    execute("git config --global user.email", function(email) {
      callback({
        name: name.replace("\n", ""),
        email: email.replace("\n", ""),
      });
    });
  });
};

module.exports.cloneFiretable = () =>
  new Promise(resolve => {
    const cloningStatus = new Spinner("Cloning the firetable repository");
    cloningStatus.start();
    execute("git clone https://github.com/AntlerVC/firetable.git", function() {
      cloningStatus.stop();
      const installingPackagesStatus = new Spinner("Installing packages");
      installingPackagesStatus.start();
      execute("cd firetable/www; yarn;", function(results) {
        installingPackagesStatus.stop();
        resolve(results);
      });
    });
  });

module.exports.setFiretableENV = envVariables =>
  new Promise(resolve => {
    const status = new Spinner("Setting environment variables");
    status.start();
    const command = `cd firetable/www; node createDotEnv ${envVariables.projectId} ${envVariables.firebaseWebApiKey} ${envVariables.algoliaAppId} ${envVariables.algoliaSearchKey}`;
    execute(command, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.setFirebaseHostingTarget = (
  projectId,
  hostingTarget,
  directory = "firetable/www"
) =>
  new Promise(resolve => {
    const status = new Spinner("Setting Firebase Hosting target");
    status.start();

    const command = `cd ${directory};echo '{}' > .firebaserc; yarn target ${hostingTarget} --project ${projectId}`;
    execute(command, function() {
      execute(`firebase use ${projectId}`, function() {
        status.stop();
        resolve(true);
      });
    });
  });

module.exports.deployToFirebaseHosting = (
  projectId,
  directory = "firetable/www"
) =>
  new Promise(resolve => {
    const status = new Spinner("Deploying to Firebase Hosting");
    status.start();
    const command = `cd ${directory}; firebase deploy --project ${projectId} --only hosting`;
    execute(command, function(results) {
      if (results.includes("Error:")) {
        throw new Error(results);
      }
      status.stop();
      resolve(true);
    });
  });

module.exports.startFiretableLocally = directory =>
  new Promise(resolve => {
    const status = new Spinner("Starting firetable locally");
    status.start();
    execute(`cd ${directory}; yarn start`, function(results) {
      status.stop();
      console.log(results);
      resolve(true);
    });
  });

module.exports.installFiretableAppPackages = directory =>
  new Promise(resolve => {
    const status = new Spinner("Installing firetable app npm packages");
    status.start();
    execute(`cd ${directory}; yarn`, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.buildFiretable = (directory = "firetable/www") =>
  new Promise(resolve => {
    const status = new Spinner(
      "Building firetable. This will take a few minutes"
    );
    status.start();
    execute(`cd ${directory}; yarn build`, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.getFirebaseProjects = () =>
  new Promise(resolve => {
    const status = new Spinner("Getting your Firebase projects");
    status.start();
    execute(`firebase projects:list`, function(results) {
      status.stop();
      //console.log(results);
      if (results.includes("Failed to authenticate")) {
        throw new Error(results);
      }
      const projects = results.match(/(?<=│.*│ )[0-z,-]*(?= *│ \d)/g);
      resolve(projects);
    });
  });

module.exports.getExistingFiretableApp = projectId =>
  new Promise(resolve => {
    const status = new Spinner("Checking for existing firetable web app");
    status.start();
    execute(`firebase apps:list WEB --project ${projectId}`, function(results) {
      status.stop();
      const firetableApp = results.match(/│ firetable-app.*/);
      if (firetableApp) {
        resolve(firetableApp[0].match(/\d:[0-9]*:web:[0-z]*/)[0]);
      } else {
        resolve(false);
      }
    });
  });

module.exports.createFiretableWebApp = projectId =>
  new Promise(resolve => {
    const status = new Spinner(`Creating a firetable web app in ${projectId}`);
    status.start();
    execute(
      `firebase apps:create --project ${projectId} web firetable-app`,
      function(results) {
        status.stop();
        resolve(results.match(/(?<=ID: ).*/)[0]);
      }
    );
  });

module.exports.getFiretableWebAppConfig = webAppId =>
  new Promise(resolve => {
    const status = new Spinner(`Getting your firetable web app config`);
    status.start();
    execute(`firebase apps:sdkconfig WEB ${webAppId}`, function(results) {
      status.stop();
      const config = results.match(/{(.*)([\s\S]*)}/)[0];
      resolve(config);
    });
  });

module.exports.createFirebaseAppConfigFile = config =>
  new Promise(resolve => {
    const status = new Spinner(`Creating firebase config file`);
    status.start();
    execute(
      `cd firetable/www/src/firebase; echo 'export default ${config.replace(
        /\n/g,
        ""
      )}' > config.ts`,
      function(results) {
        status.stop();
        resolve(results);
      }
    );
  });
