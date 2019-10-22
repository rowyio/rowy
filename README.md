## Firetable

Firetable an Excel view for Firestore.

## Setup instructions

#### 1) Create a firebase project

- enable firestore
- enable firstore rules
- enable firebase billing
- enable google auth

#### 2) Create an algolia project

- get the generated appId,API key and search key

#### 3) Clone repo

```
git clone https://github.com/AntlerVC/firetable.git
```

#### 4) Setup cloud functions

insure that you have firebase cli installed

```
firebase functions:config:set algolia.appid=YOUR_APP_ID algolia.apikey=ADMIN_API_KEY
```

Deploy the cloud functions to your firebase project

```

```

#### 5) Set environment variables

create a .env file in the www directory

```
REACT_APP_FIREBASE_PROJECT_NAME =
REACT_APP_FIREBASE_PROJECT_KEY =
REACT_APP_ALGOLIA_APP_ID =
REACT_APP_ALGOLIA_SEARCH_KEY =
```

#### 6) Install dependencies

```
cd www;yarn
```

#### 7) Run project locally

```
yarn start
```
