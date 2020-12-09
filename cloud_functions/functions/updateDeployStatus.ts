// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;
admin.initializeApp();
const db = admin.firestore();

const main = async (deployRequestPath: string, currentBuild) => {
  await db.doc(deployRequestPath).update({
    deployedAt: serverTimestamp(),
    currentBuild: currentBuild ?? "",
  });
  return true;
};

main(process.argv[2], process.argv[3])
  .catch((err) => console.log(err))
  .then(() => console.log("this will succeed"))
  .catch(() => "obligatory catch");
