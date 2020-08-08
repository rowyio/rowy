var exec = require("child_process").exec;
const CLI = require("clui");
const Spinner = CLI.Spinner;

function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    //console.log({ error, stdout, stderr });
    callback(stdout);
  });
}

module.exports.getRequiredVersions = () =>
  new Promise((resolve, reject) => {
    const checkingVersionsStatus = new Spinner(
      "Checking the versions of required system packages, please wait..."
    );
    checkingVersionsStatus.start();
    execute("git --version", function(git) {
      execute("node --version", function(node) {
        execute("yarn --version", function(yarn) {
          execute("firebase --version", function(firebase) {
            checkingVersionsStatus.stop();
            resolve({
              node: node.replace("\n", ""),
              git: git.replace("\n", ""),
              yarn: yarn.replace("\n", ""),
              firebase: firebase.replace("\n", ""),
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
  new Promise((resolve, reject) => {
    const cloningStatus = new Spinner(
      "cloning the firetable repository, please wait..."
    );
    cloningStatus.start();
    execute("git clone https://github.com/AntlerVC/firetable.git", function() {
      cloningStatus.stop();
      const installingPackagesStatus = new Spinner("installing packages");
      installingPackagesStatus.start();
      execute("cd firetable/www;yarn;", function(results) {
        installingPackagesStatus.stop();
        resolve(results);
      });
    });
  });

module.exports.setFiretableENV = envVariables =>
  new Promise((resolve, reject) => {
    const status = new Spinner("setting environment variables, please wait...");
    status.start();
    const command = `cd firetable/www;node createDotEnv ${envVariables.projectId} ${envVariables.firebaseWebApiKey} ${envVariables.algoliaAppId} ${envVariables.algoliaSearchKey}`;
    execute(command, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.setFirebaseHostingTarget = (projectId, hostingTarget) =>
  new Promise((resolve, reject) => {
    const status = new Spinner("setting environment variables, please wait...");
    status.start();
    const command = `cd firetable/www;yarn target ${hostingTarget} --project ${projectId}`;
    execute(command, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.deployToFirebaseHosting = projectId =>
  new Promise((resolve, reject) => {
    const status = new Spinner("deploying to firebase hosting, please wait...");
    status.start();
    const command = `cd firetable/www;firebase deploy --project ${projectId} --only hosting`;
    execute(command, function(result) {
      status.stop();
      resolve(true);
    });
  });

module.exports.startFiretableLocally = () =>
  new Promise((resolve, reject) => {
    const status = new Spinner("Starting firetable locally, please wait...");
    status.start();
    execute(`cd firetable/www;yarn start`, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.buildFiretable = () =>
  new Promise((resolve, reject) => {
    const status = new Spinner(
      "Building firetable, this one might take a while \u{1F602}..."
    );
    status.start();
    execute(`cd firetable/www;yarn build`, function() {
      status.stop();
      resolve(true);
    });
  });

module.exports.getFirebaseProjects = () =>
  new Promise((resolve, reject) => {
    const status = new Spinner("Getting your firebase projects...");
    status.start();
    execute(`firebase projects:list`, function(results) {
      status.stop();
      const projects = results
        .split(
          `├──────────────────────┼────────────────────────┼────────────────┼──────────────────────┤`
        )
        .map(line => line.split(" │ ")[1].trim());
      projects.shift();
      resolve(projects);
    });
  });

module.exports.createFiretableWebApp = projectId =>
  new Promise((resolve, reject) => {
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
  new Promise((resolve, reject) => {
    const status = new Spinner(`getting your web app config`);
    status.start();
    execute(`firebase apps:sdkconfig WEB ${webAppId}`, function(results) {
      status.stop();
      const config = results.match(/{(.*)([\s\S]*)}/)[0];
      resolve(config);
    });
  });

module.exports.createFirebaseAppConfigFile = config =>
  new Promise((resolve, reject) => {
    const status = new Spinner(`creatING firebase config file.`);
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
