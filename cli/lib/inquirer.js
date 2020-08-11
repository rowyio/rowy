const inquirer = require("inquirer");

module.exports = {
  selectFirebaseProject: projects =>
    inquirer.prompt({
      name: "projectId",
      type: "list",
      message: "Select the firebase project you want deploy to:",
      choices: projects,
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter your the firebase project id you would like to deploy to.\n or you can create new project here:https://console.firebase.google.com/project";
        }
      },
    }),
  installAlgolia: () => {
    const questions = [
      {
        type: "confirm",
        name: "installAlgolia",
        message:
          "do you want integrate firetable with algolia? \n You can add it later on, if you don't have it setup yet",
      },
    ];
    return inquirer.prompt(questions);
  },

  askAlgoliaVariables: () => {
    const questions = [
      {
        name: "algoliaAppId",
        type: "input",
        message: "Enter your Algolia App ID:",
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return "Please enter your Algolia App ID.\n or you can create new project here:https://algolia.com ";
          }
        },
      },
      {
        name: "algoliaSearchKey",
        type: "input",
        message: "Enter your Algolia search key(not the admin key)",
        validate: function(value) {
          if (value.length > 5) {
            return true;
          } else {
            return "Please enter a valid api key ";
          }
        },
      },
    ];
    return inquirer.prompt(questions);
  },
  deployToFirebaseHosting: () =>
    inquirer.prompt({
      type: "confirm",
      name: "deployToFirebase",
      message: "Do you want deploy firetable on firebase hosting?",
    }),
  askChangeFirebaseHostTarget: hostTarget =>
    inquirer.prompt({
      type: "confirm",
      name: "changeTarget",
      default: false,
      message: `do you want to change your current host target (${hostTarget}) ?`,
    }),
  askFirebaseHostTarget: projectId =>
    inquirer.prompt({
      type: "input",
      name: "hostTarget",
      message: `where do you want to deploy?\n you can find your available sites or create new one here: 'https://console.firebase.google.com/u/0/project/${projectId}/hosting' \n enter your site name: `,
    }),
};
