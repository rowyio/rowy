# [![Firetable](./www/src/assets/firetable-with-wordmark.svg)](https://firetable.io/)

Firetable is a spreadsheet-like UI for Firestore.

No more building admin portals to let business users to access data from Google
Cloud.

![Commit](https://img.shields.io/github/last-commit/AntlerVC/firetable?color=%23ed4747)

### Firetable UI

Supports fields such as images, files, single/multi select, in addition to
standard fields. Functions such as row resizing, data import/export are
supported. More coming soon, for comprehensive list see ROADMAP.md.

![Firetable screenshot](https://firetable.io/demo-screenshot.png)

## Setup instructions

### 1. Create a Firebase project [(Instructions)](https://console.firebase.google.com/u/0/)

- Create a Firestore database
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

### 2. (Optional) Create an [Algolia](https://algolia.com) project

- Algolia’s free **Community** plan is sufficient

#### Why Algolia?

Algolia is currently used for the **Connect Table** cell type to link a cell to
another row in another table. It may also be used in the future for further
plain text search and filtering capabilities.

You can **opt out** of Algolia by commenting out the following lines in
`cloud_functions/functions/src/index.ts`:

```ts
import algoliaFnsGenerator from "./algolia";
import algoliaConfig from "./algolia/algoliaConfig";
export const algolia = algoliaConfig.reduce((acc: any, collection) => {
  return { ...acc, [collection.name]: algoliaFnsGenerator(collection) };
}, {});
```

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

- Set cloud environment keys for Algolia: get the generated **Application ID**
  and **Admin API Key** from the Algolia **API Keys** page

```
firebase functions:config:set algolia.app=YOUR_APP_ID algolia.key=ADMIN_API_KEY
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

## Issues

[Please create issues here.](https://github.com/antlervc/firetable/issues)  
Make sure to provide console log outputs and screenshots!

## Roadmap and feature requests

- [View our roadmap here](ROADMAP.md)
- [View our ideas and feature requests here](https://github.com/AntlerVC/firetable/projects/1)

---

## About Antler Engineering

Firetable is created and being actively developed by
[Antler Engineering](https://twitter.com/AntlerEng).

At [Antler](https://antler.co), we identify and invest in exceptional people.

We’re a global startup generator and early-stage VC firm that builds
groundbreaking technology companies.

[Apply now](https://antler.co/apply) to be part of a global cohort of tech
founders.
