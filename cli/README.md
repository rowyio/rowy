# Firetable CLI

## Prerequisites

please insure you have the following installed;
[Git](https://git-scm.com/downloads), [Node](https://nodejs.org/en/download/),
[Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Firebase

insure that you have [firebase-tools](https://firebase.google.com/docs/cli) and
logged in to your firebase account.

## Installation

```
npm install -g firetable@latest
```

## Setup

set directory you want to setup firetable in then run

```
firetable init
```

### run Locally

```
firetable start
```

### deploying to firebase hosting

insure that you have created a site on your projects
[firebase hosting](https://console.firebase.google.com/u/0/project/_/hosting)

then run

```
firetable deploy
```
