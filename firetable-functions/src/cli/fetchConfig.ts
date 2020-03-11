#!/usr/bin/env node

import * as fs from "fs";
// Initialize Firebase Admin
import * as admin from "firebase-admin";
// Initialize Firebase Admin

export default async function (options: { output?: string}) {

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./firebase-credentials.json";

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  }
  catch {
    throw new Error(
      `Couldn't find service account file at ${process.cwd()}/${credentialsPath}, set it through -c option or GOOGLE_APPLICATION_CREDENTIALS environment variable`
    );
  }

  console.error(`Running on ${serviceAccount.project_id}`);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
  const db = admin.firestore();

  const fetchAllDocConfigs = async (...docPaths: string[]) => {
    const docRefs = docPaths.map(docPath => db.doc(docPath))
    const docs = await db.getAll(...docRefs)
    return docs.map(doc => doc.data()?.config);
  };

  // Initialize Cloud Firestore Database
  const docConfig2json = (data: any, path?: string) => {
    const jsonData = JSON.stringify(data, null, 2);
    if(path) {
      fs.writeFileSync(path, jsonData);
    }
    else {
      console.log(jsonData);
    }
  }

  const [history, algolia, sync] = await fetchAllDocConfigs(
    "_FIRETABLE_/_SETTINGS_/_CONFIG_/_HISTORY_",
    "_FIRETABLE_/_SETTINGS_/_CONFIG_/_ALGOLIA_",
    "_FIRETABLE_/_SETTINGS_/_CONFIG_/_COLLECTION_SYNC_",
  )
  docConfig2json({ history, algolia, sync }, options.output)
};


