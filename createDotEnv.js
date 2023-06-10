const fs = require("fs");

const main = (
  projectID = "",
  firebaseWebApiKey = "",
  algoliaAppId = "",
  algoliaSearhApiKey = ""
) => {
  return fs.writeFileSync(
    ".env",
    `VITE_APP_FIREBASE_PROJECT_ID = ${projectID}
VITE_APP_FIREBASE_PROJECT_WEB_API_KEY = ${firebaseWebApiKey}
VITE_APP_ALGOLIA_APP_ID = ${algoliaAppId}
VITE_APP_ALGOLIA_SEARCH_API_KEY = ${algoliaSearhApiKey}`
  );
};

main(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
