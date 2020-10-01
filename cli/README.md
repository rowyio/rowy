# Firetable CLI

## Installation requirements

Make sure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/) 10, 11, or 12
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Firebase CLI](https://firebase.google.com/docs/cli)

Also make sure you are logged in to your Firebase account in the Firebase CLI.

## Installation

```
yarn global add firetable
```

## Commands

### Create a new project

```
firetable init [directory]
```

### Run firetable locally

Before you run locally, make sure you have a Firebase project set up.
[Instructions](https://github.com/AntlerVC/firetable#setup-instructions)

```
firetable start
```

### Deploy to Firebase Hosting

First, make sure that you have created a site in your Firebase project.
[Open Firebase console](https://console.firebase.google.com/)

```
firetable deploy
```

## Firebase Rules & Firetable roles

Read more about firebase rules for firetable
[HERE](https://github.com/AntlerVC/firetable/blob/master/RULES.md)

### Setting user Roles

Download the service account key for your project then add it to the directory
without renaming it. You can find your service account here:
https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk

```
firetable auth:setRoles <email> <roles>
```

email: needs to be associated with an existing firebase account on the example
roles: can be one role `ADMIN` or a comma separated array `ADMIN,OPS,DEV`

```
firetable auth:setRoles shams@antler.co OPS,INTERNAL
```
