## Firetable

Firetable an Excel view for Firestore.

## Setup instructions

#### 1) Create a firebase project [here](https://console.firebase.google.com/u/0/)

- enable firestore
- setup security rules: test mode or setup required permission
- upgrade project to Blaze plan
- go to authentication/ sign method enable google auth

#### 2) Create an algolia project

- get the generated appId,API key and search key

#### 3) Clone repo

```
git clone https://github.com/AntlerVC/firetable.git
```

#### 4) Setup cloud functions

install dependencies

```
cd cloud_functions/functions;yarn
```

insure that you have firebase cli installed, [instructions](https://firebase.google.com/docs/cli)

then set cloud environment keys using the following commands

```
firebase functions:config:set algolia.appid=YOUR_APP_ID algolia.apikey=ADMIN_API_KEY
```

Deploy the cloud functions to your firebase project

```
yarn deploy
```

#### 5) Set environment variables

Add .env file to the www directory

```
REACT_APP_FIREBASE_PROJECT_NAME =
REACT_APP_FIREBASE_PROJECT_KEY =
REACT_APP_ALGOLIA_APP_ID =
REACT_APP_ALGOLIA_SEARCH_KEY =
```

#### 6) Run frontend

install dependencies

```
cd www;yarn
```

#### 7) Run project locally

```
yarn start
```
