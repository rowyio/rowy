## Firetable

Firetable is a simple CMS for Google Cloud Firestore.

## Setup instructions

#### 1) Create a firebase project
   - enable firestore
   - enable google auth
#### 2) Create an algolia project
#### 3) Setup cloud functions

```
firebase functions:config:set algolia.appid=YOUR_APP_ID algolia.apikey=ADMIN_API_KEY
```

Deploy the following callable cloud functions to update and delete algolia records

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

#### 4) Clone repo
#### 5) Set environment variables

Add .env file to the project directory

```
REACT_APP_FIREBASE_PROJECT_NAME =
REACT_APP_FIREBASE_PROJECT_KEY =
REACT_APP_ALGOLIA_APP_ID =
REACT_APP_ALGOLIA_SEARCH_KEY =
```

#### 6) Install dependencies

```
yarn
```

#### 7) Run project locally

```
yarn start
```
