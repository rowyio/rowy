import { CONFIG, USERS, PUBLIC_SETTINGS } from "./dbPaths";

export const requiredRules = `
    // Rowy: Allow signed in users to read Rowy configuration and admins to write
    match /${CONFIG}/{docId} {
      allow read: if request.auth != null;
      allow write: if hasAnyRole(["ADMIN", "OWNER"]);
    	match /{document=**} {
        allow read: if request.auth != null;
        allow write: if hasAnyRole(["ADMIN", "OWNER"]);
      }
    }
    // Rowy: Allow users to edit their settings
    match /${USERS}/{userId} {
      allow get, update, delete: if isDocOwner(userId);
      allow create: if request.auth != null;
    }
    // Rowy: Allow public to read public Rowy configuration
    match /${PUBLIC_SETTINGS} {
    	allow get: if true;
    }
` as const;

export const adminRules = `
    // Allow admins to read and write all documents
    match /{document=**} {
      allow read, write: if hasAnyRole(["ADMIN", "OWNER"]);
    }
` as const;

export const utilFns = `
    // Rowy: Utility functions
    function isDocOwner(docId) {
      return request.auth != null && (request.auth.uid == resource.id || request.auth.uid == docId);
    }
    function hasAnyRole(roles) {
      return request.auth != null && request.auth.token.roles.hasAny(roles);
    }
` as const;

export const insecureRule = `
    match /{document=**} {
      allow read, write: if true;
    }
` as const;
