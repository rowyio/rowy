import * as fs from "fs";
// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin

const serviceAccount = requireIfExists(`./firebase-credentials.json`);

function requireIfExists(module) {
  try {
    return require(module);
  } catch (error) {
    console.log("serviceAccount json not found");
    return false;
  }
}
if (serviceAccount) {
  console.log(`Running on ${serviceAccount.project_id}`);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
  const db = admin.firestore();

  const docConfig2json = async (docPath: string, jsonPath: string) => {
    const doc = await db.doc(docPath).get();
    const data = doc.data();
    const jsonData = JSON.stringify(data ? data.config : "[]");
    fs.writeFileSync(jsonPath, jsonData);
  };

  // Initialize Cloud Firestore Database

  const main = async () => {
    await docConfig2json(
      "_FIRETABLE_/_SETTINGS_/_CONFIG_/_HISTORY_",
      "./src/history/config.json"
    );
    await docConfig2json(
      "_FIRETABLE_/_SETTINGS_/_CONFIG_/_ALGOLIA_",
      "./src/algolia/config.json"
    );
    await docConfig2json(
      "_FIRETABLE_/_SETTINGS_/_CONFIG_/_COLLECTION_SYNC_",
      "./src/collectionSync/config.json"
    );
    await docConfig2json(
      "_FIRETABLE_/_SETTINGS_/_CONFIG_/_SNAPSHOT_SYNC_",
      "./src/snapshotSync/config.json"
    );
    return true;
  };

  main()
    .catch(err => console.log(err))
    .then(() => console.log("this will succeed"))
    .catch(() => "obligatory catch");
}
