export const RULES_START = `rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
`;

export const RULES_END = `
  }
}`;

export const REQUIRED_RULES = `
    // Rowy: Allow signed in users with Roles to read and write to Storage
    match /{allPaths=**} {
      allow read, write: if request.auth.token.roles.size() > 0;
    }
`;
