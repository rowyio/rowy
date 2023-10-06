const admin = require("firebase-admin");

// 👉 Set your rowy admin user email address:
const mainAccountEmail = "atai@tawkit.app";

// 👉 Set your project ID. Find it in:
// https://console.firebase.google.com/project/_/settings/general
const projectId = "tawkit-rowy";
console.log(`Running on ${projectId}`);

// 👉 Import your service account key file.
// Make sure to change this path if necessary.
const serviceAccount = require(`./firebase-service-account.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`,
});
const auth = admin.auth();

const setClaims = async (email, claims) => {
  const user = await auth.getUserByEmail(email);
  auth.setCustomUserClaims(user.uid, claims);
};

// 👉 Call the setClaims function. Set the email and roles here.
setClaims(mainAccountEmail, {
  roles: ["ADMIN"],
});
