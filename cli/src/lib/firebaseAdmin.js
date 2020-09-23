const admin = require("firebase-admin");
const fs = require("fs");

const CLI = require("clui");
const Spinner = CLI.Spinner;

const initializeApp = (serviceAccountFile) => {
  console.log(serviceAccountFile);
  var serviceAccount = fs.readFileSync(`./${serviceAccountFile}`, {
    encoding: "utf8",
  });
  const serviceAccountJSON = JSON.parse(serviceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountJSON),
    databaseURL: `https://${serviceAccountJSON.project_id}.firebaseio.com`,
  });
  const auth = admin.auth();
  const db = admin.firestore();
  return { auth, db };
};
module.exports.setUserRoles = (serviceAccountFile) => async (email, roles) => {
  try {
    const { auth } = initializeApp(serviceAccountFile);
    // Initialize Auth
    // sets the custom claims on an account to the claims object provided
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, roles });
    return {
      success: true,
      message: `✅ ${email} now has the following roles ✨${roles.join(
        " & "
      )}✨`,
    };
  } catch (error) {
    return {
      success: false,
      code: "auth/user-not-found",
      message: error.message,
    };
  }
};

module.exports.getProjectTables = (serviceAccountFile) => async () => {
  try {
    const status = new Spinner("Fetching firetable collections");
    status.start();
    // Initialize DB
    const { db } = initializeApp(serviceAccountFile);

    // sets the custom claims on an account to the claims object provided
    const tablesDoc = await db.doc("_FIRETABLE_/settings").get();
    status.stop();

    return tablesDoc
      .data()
      ["tables"].filter((table) => !table.isCollectionGroup);
    // return {
    //   success: true,
    //   message: `✅ ${email} now has the following roles ✨${roles.join(
    //     " & "
    //   )}✨`,
    // };
  } catch (error) {
    throw new Error(error.message);
  }
};
