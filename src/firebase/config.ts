const STAGING_PROJECT_NAME = "firetable-antler";
//const PRODUCTION_PROJECT_NAME = STAGING_PROJECT_NAME;

const stagingKey = "AIzaSyCoFFczj76Pew47JsytwKFeUX3GN3Gfgq0";
//const productionKey = stagingKey;

export const stagingConfig = {
  apiKey: stagingKey,
  authDomain: `${STAGING_PROJECT_NAME}.firebaseapp.com`,
  databaseURL: `https://${STAGING_PROJECT_NAME}.firebaseio.com`,
  projectId: STAGING_PROJECT_NAME,
  storageBucket: `${STAGING_PROJECT_NAME}.appspot.com`,
  messagingSenderId: "677967978263",
  appId: "1:677967978263:web:a5b1ffb0c4d7a798076152",
  measurementId: "G-LQ1N70N2CS",
};

export const productionConfig = stagingConfig;
