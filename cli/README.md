# Firetable CLI

The Firetable CLI automates the steps required to set up the Firetable app and
other operations on your computer.

<table><tbody><tr><td>

### Contents

- [Installation requirements](#installation-requirements)
- [Install the Firetable CLI](#install-the-firetable-cli)
- [Commands](#commands)
  - [Create a new project](#create-a-new-project)
  - [Run Firetable locally](#run-firetable-locally)
  - [Deploy to Firebase Hosting](#deploy-to-firebase-hosting)
  - [Set user roles for Firestore Security Rules](#set-user-roles-for-firestore-security-rules)
  - [Deploy Firetable Cloud Functions](#deploy-firetable-cloud-functions)

</td></tr></tbody></table>

## Installation requirements

Make sure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/) 10, 11, or 12
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Firebase CLI](https://firebase.google.com/docs/cli)

Also, make sure you are logged in to your Firebase account in the Firebase CLI:

```
firebase login
```

## Install the Firetable CLI

Install the Firetable CLI globally.

```
yarn global add firetable
```

## Commands

### Create a new project

```
firetable init [directory]
```

### Run Firetable locally

Before you run locally, make sure you have a Firebase project set up.
[Instructions →](https://github.com/AntlerVC/firetable/wiki/Getting-Started)

```
firetable start
```

### Deploy to Firebase Hosting

First, make sure that you have created a site in your Firebase project.
[Open Firebase console](https://console.firebase.google.com/project/_/hosting/main)

```
firetable deploy
```

### Set user roles for Firestore Security Rules

Firetable has role-based access controls using Firestore Security Rules and
custom claims in Firebase Authentication.
[Read more →](https://github.com/AntlerVC/firetable/wiki/Role-Based-Security-Rules)

You can use the Firetable CLI the roles of Firebase Authentication users.

1. Download your project’s service account private key file from the Firebase
   Console in
   [Project Settings > Service Accounts.](https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk)
   This is used to run Firebase Admin SDK commands on your computer.

2. Save the JSON file, without renaming it, in your current working directory.  
   The file name should look like
   `PROJECT-ID-firebase-adminsdk-ALPHANUMERIC-CHARACTERS.json`

3. Run the following command to set the roles of the Firebase Authentication
   user.  
   You can view all users in Firebase Authentication and find their emails in
   the
   [Firebase Console.](https://console.firebase.google.com/project/_/authentication/users)

   ```
   firetable auth:setRoles <email> <roles>
   ```

   [Example user roles →](https://github.com/AntlerVC/firetable/wiki/Role-Based-Security-Rules#example-roles)

### Deploy Firetable Cloud Functions

Easily deploy Cloud Functions used to extend Firetable. You can choose which
functions you want to deploy.

```
firetable functions:deploy
```
