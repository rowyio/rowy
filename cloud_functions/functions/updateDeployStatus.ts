// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
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

  const main = async deployRequestPath => {
    await db.doc(deployRequestPath).update({ deployedAt: serverTimestamp() });
  };

  main(process.argv[2])
    .catch(err => console.log(err))
    .then(() => console.log("this will succeed"))
    .catch(() => "obligatory catch");
}
