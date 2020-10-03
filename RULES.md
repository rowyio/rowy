# Firetable Rules

Firetable uses a Role based access control on top of
[firestore rules](https://firebase.google.com/docs/firestore/security/get-started).

## Firestore Rules Base

```
rules_version = '2'
service cloud.firestore {
   match /databases/{database}/documents {
      match /{document=**} {
         // this is gives full rights to users with an admin role
         allow read, write: if hasRole("ADMIN")
      }
      match /_FIRETABLE_/settings {

        // specify the roles that have access firetable configuration
        // this allows users to view tables and columns on firetable but without the ability to modify them
         allow read: if hasAnyRole(["INTERNAL"])
         match /{collection=**}/{tableName} {
            allow read: if hasAnyRole(["INTERNAL"])
         }
      }

      match /_FT_USERS/{docId} {
        // allows to store firetable user customizations such as filters and favorite tables
         allow get, update, create, write:if isOwner(docId)
      }

      // utility functions
      function hasRole(role) {
         return role in request.auth.token.roles
      }
      function hasAnyRole(roles) {
         return request.auth.token.roles.hasAny(roles)
      }
      function isOwner(docId) {
        // turns a boolean for if the authenticated user has the same uid as the resource document id
         return request.auth.uid == resource.id || request.auth.uid == docId
      }
   }
}

```

## Custom claims

The firetable roles are stored in the users firebase auth token custom claims

[(firebase auth Docs)](https://firebase.google.com/docs/auth/admin/custom-claims)

### setting roles

You can use the CLI tool to set your roles
[here](https://github.com/AntlerVC/firetable/blob/master/cli/README.md#Setting-user-Roles)

It relays on this basic script. you can run this locally using the adm sdk or
implement it in your cloud functions

```js
import * as admin from "firebase-admin";
//set your project id
const projectId = "YOUR FIREBASE PROJECT ID HERE";
console.log(`Running on ${projectId}`);
// you can get the admin sdk service account key from the url bellow, remember to add your project Id
//https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk
var serviceAccount = require(`./firebase-service-account.json`);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`,
});
// Initialize Auth
export const auth = admin.auth();

// sets the custom claims on an account to the claims object provided
const setClaims = async (email, claims) => {
  const user = await auth.getUserByEmail(email);
  auth.setCustomUserClaims(user.uid, claims);
};

setClaims("enter your email", {
  roles: ["ADMIN"],
});
```
