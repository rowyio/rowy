const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },
  findFile: (fileRegex) =>
    new Promise((resolve, reject) =>
      fs.readdir("./", (err, files) => {
        const file = files
          .map((file) => file.match(fileRegex))
          .filter((_file) => _file)[0];
        if (file) {
          resolve(file[0]);
        } else {
          reject(
            "Can not find the firebase service account key json file, download the admin key for your project then add it to this directory without renaming it.\nYou can find your service account here: https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk"
          );
        }
      })
    ),
};
