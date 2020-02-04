# [![Firetable](./www/src/assets/firetable-with-wordmark.svg)](https://firetable.io/)

Firetable is a spreadsheet-like UI for Firestore.

No more building admin portals to let business users to access data from Google
Cloud.

### Firetable UI

Supports fields such as images, files, single/multi select, in addition to
standard fields. Functions such as row resizing, data import/export are
supported. More coming soon, for comprehensive list see ROADMAP.md.

![Firetable screenshot](https://firetable.io/static/demo-screenshot-0732a04a6a01316f4c423b2055198dec.png)

## Setup instructions

### 1. Create a Firebase project [(Instructions)](https://console.firebase.google.com/u/0/)

- Enable the Firestore database
- Set up Firestore Security Rules: use Test Mode or set up required permissions.
  Below are sample rules that allow for unlimited access to the entire database:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
- Upgrade project to the Blaze Plan
- Enable the Google sign-in method in **Authentication / Sign-in method**

### 2. Create an [Algolia](https://algolia.com) project

- Get the generated **Application ID** and **Search-Only API Key** from the
  **API Keys** page

### 3. Clone this repo

```
git clone https://github.com/AntlerVC/firetable.git
```

### 4. Set up Cloud Functions

- Install dependencies

```
cd cloud_functions/functions
yarn
```

- Ensure that you have Firebase CLI installed.
  [(Instructions)](https://firebase.google.com/docs/cli)

- Set cloud environment keys for Algolia

```
firebase functions:config:set algolia.appid=YOUR_APP_ID algolia.apikey=ADMIN_API_KEY
```

- Deploy the Cloud Functions to your Firebase project

```
yarn deploy
```

### 5. Set React app environment variables

Create a .env file in the `www` directory

- Get the generated **Application ID** and **Search-Only API Key** from the
  Algolia **API Keys** page

- Get the Firebase **Project ID** and **Web API Key** from your Firebase
  Project’s **Settings** page. Click the cog icon on the left sidebar (under the
  Firebase logo) and click **Project settings**

```
REACT_APP_ALGOLIA_APP_ID=
REACT_APP_ALGOLIA_SEARCH_API_KEY=

REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_PROJECT_WEB_API_KEY=
```

### 6. Install front-end dependencies

```
cd www
yarn
```

### 7. Run project locally

```
yarn start
```
