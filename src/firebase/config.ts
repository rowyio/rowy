const STAGING_PROJECT_NAME = "antler-vc";
const PRODUCTION_PROJECT_NAME = STAGING_PROJECT_NAME;

const stagingKey = "AIzaSyCADXbyMviWpJ_jPp4leEYMffL70Ahxo_k";
const productionKey = stagingKey;

export const stagingConfig = {
  apiKey: stagingKey,
  authDomain: `${STAGING_PROJECT_NAME}.firebaseapp.com`,
  databaseURL: `https://${STAGING_PROJECT_NAME}.firebaseio.com`,
  projectId: STAGING_PROJECT_NAME,
  storageBucket: `${STAGING_PROJECT_NAME}.appspot.com`,
  messagingSenderId: "236015562107"
};

export const productionConfig = stagingConfig;
