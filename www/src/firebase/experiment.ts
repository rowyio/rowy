import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

export let auth: any = false;

export let db: any = false;

export let bucket: any = false;
export let functions: any = false;

export let googleProvider: any = false;

console.log(`fetching config for ${window.location.hostname.split(".")[0]}`);
fetch(
  `https://us-central1-firetable-magic.cloudfunctions.net/getWebAppConfig?projectId=${
    window.location.hostname.split(".")[0] ?? "antler-vc"
  }`
)
  .then(async (response) => {
    const config = await response.json();
    console.log({ config });
    firebase.initializeApp(config);
    auth = firebase.auth();

    db = firebase.firestore();
    // db.settings({ cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED });
    // db.enablePersistence({ synchronizeTabs: true });

    bucket = firebase.storage();
    functions = firebase.functions();

    googleProvider = new firebase.auth.GoogleAuthProvider().setCustomParameters(
      {
        prompt: "select_account",
      }
    );
  })
  .catch((err) => console.log(err));

export const deleteField = firebase.firestore.FieldValue.delete;
