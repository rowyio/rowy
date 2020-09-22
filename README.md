# [![Firetable](./www/src/assets/firetable-with-wordmark.svg)](https://firetable.io/)

Firetable is a spreadsheet-like UI for Firestore.

No more building admin portals to let business users to access data from Google
Cloud.

![Commit](https://img.shields.io/github/last-commit/AntlerVC/firetable?color=%23ed4747)

<!-- [![Discord Shield](https://discordapp.com/api/guilds/746329234720686132/widget.png?style=shield)](https://discord.gg/Vdshr9E) -->

### Firetable UI [(Live Demo)](https://try.firetable.io)

Supports fields such as images, files, single/multi select, in addition to
standard fields. Functions such as row resizing, csv data import/export and much more!

![Firetable screenshot](https://firetable.io/demo.gif)

## Setup instructions

### Installation requirements

Make sure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/) 10, 11, or 12
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### 1. Create and set up a Firebase project

- Create a new project using the
  [Firebase Console](https://console.firebase.google.com/)
- Create a Firestore database
- Set up Firestore Security Rules: use Test Mode or set up required permissions.

  Below are sample rules that allow for unlimited access to the entire database
  just for quick testing purpose:

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

  [Or follow this guide for setting up custom rules](RULES.md)

- Upgrade project to the Blaze Plan
- Enable the Google sign-in method in **Authentication / Sign-in method**
  - **⚠️ IMPORTANT:** If you try to sign in and see “This account does not have
    any roles”, run
    [the following script](https://github.com/AntlerVC/firetable/blob/develop/RULES.md#custom-claims)
    on your Firebase Authentication user.

### 2. Run the Firetable CLI

The Firetable CLI automates the steps required to set up your Firetable app
locally.

Before using it, make sure you have the Firebase CLI installed.
[Instructions](https://firebase.google.com/docs/cli)

```
yarn global add firetable
```

Then run the following command, specifying the directory for your Firetable app.

```
firetable init [directory]
```

Now you can run Firetable locally using

```
cd [directory]
firetable start
```

### Manually set up Firetable app

If you don’t want to run the Firetable CLI, follow these steps:

#### 1. Clone this repo

```
git clone https://github.com/AntlerVC/firetable.git
```

#### 2. Set React app environment variables

Create a .env file in the `www` directory

- Get the Firebase **Project ID** and **Web API Key** from your Firebase
  Project’s **Settings** page. Click the cog icon on the left sidebar (under the
  Firebase logo) and click **Project settings**

- (Optional) Get the generated **Application ID** and **Search-Only API Key**
  from the Algolia **API Keys** page

```
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_PROJECT_WEB_API_KEY=
REACT_APP_ALGOLIA_APP_ID=
REACT_APP_ALGOLIA_SEARCH_API_KEY=
```

#### 3. Install front-end dependencies

```
cd www
yarn
```

#### 4. Run project locally

```
yarn start
```

## Issues

[Please create issues here.](https://github.com/antlervc/firetable/issues)  
Make sure to provide console log outputs and screenshots!

### Known Issue: “This account does not have any roles”

If you try to sign in and see “This account does not have any roles”, run
[the following script](https://github.com/AntlerVC/firetable/blob/develop/RULES.md#custom-claims)
on your Firebase Authentication user.

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

[Apply now](https://www.antler.co/apply?utm_source=Firetable&utm_medium=website&utm_campaign=Thu%20Apr%2016%202020%2018:00:00%20GMT%2B0200%20(CEST)&utm_content=TechTracking) to be part of a global cohort of tech
founders.
