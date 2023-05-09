import path from "path";
import * as dotenv from "dotenv";

import { App, cert, initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

dotenv.config({ path: path.join(__dirname, "..", "..", "..", ".env.test") });

const serviceAccount =
  process.env.FIREBASE_SERVICE_ACCOUNT &&
  JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const projectId =
  serviceAccount?.project_id || process.env.REACT_APP_FIREBASE_PROJECT_ID;

let app: App;
let auth: Auth;
let firestore: Firestore;

if (serviceAccount) {
  console.log("service account: ", serviceAccount);
  app = initializeApp({
    projectId,
    credential: serviceAccount ? cert(serviceAccount) : undefined,
  });
  auth = getAuth(app);
  firestore = getFirestore(app);
} else {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:9299";
  app = initializeApp({ projectId });
  auth = getAuth();
  firestore = getFirestore(app);
}

export { app, auth, firestore };
