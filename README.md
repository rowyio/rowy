## Firetable

Firetable is a simple CMS for Google Firebase.

## Setup instructions

create a firebase project

- enable firestore
- enable google auth
  create an algolia project

Cloud functions setup

set environment variables

```
firebase functions:config:set algolia.app=YOUR_APP_ID algolia.key=ADMIN_API_KEY
```

deploy update and delete algolia records

```
const functions = require("firebase-functions");
const env = functions.config();
const algolia = require("algoliasearch");
exports.updateAlgoliaRecord = functions.https.onCall(async (data, context) => {
    const client = algolia(env.algolia.appid, env.algolia.apikey);
    const index = client.initIndex(data.collection);
    await index.partialUpdateObject(Object.assign({ objectID: data.id }, data.doc));
    return true;
});

exports.deleteAlgoliaRecord = functions.https.onCall(async (data, context) => {
    const client = algolia(env.algolia.appid, env.algolia.apikey);
    const index = client.initIndex(data.collection);
    await index.deleteObject(data.id);
    return true;
});
```

Clone repo

add .env file to the project directory

```
REACT_APP_FIREBASE_PROJECT_NAME =
REACT_APP_FIREBASE_PROJECT_KEY =
REACT_APP_ALGOLIA_APP_ID =
REACT_APP_ALGOLIA_SEARCH_KEY =
```

install dependencies

```
yarn
```

Run project locally

```
yarn start
```
