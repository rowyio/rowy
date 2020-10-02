const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },
  findFile: (fileRegex, notFoundMessage) =>
    new Promise((resolve, reject) =>
      fs.readdir("./", (err, files) => {
        const file = files
          .map((file) => file.match(fileRegex))
          .filter((_file) => _file)[0];
        if (file) {
          resolve(file[0]);
        } else {
          reject(notFoundMessage);
        }
      })
    ),
};
