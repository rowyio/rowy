const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
import { asyncExecute } from "./compiler/terminal";
import generateConfig from "./compiler";
import { auth } from "./firebaseConfig";
import meta from "./package.json";
import { commandErrorHandler, logErrorToDB } from "./utils";

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

app.get("/", async (req: any, res: any) => {
  res.send(`Firetable cloud function builder version ${meta.version}`);
});

app.post("/", jsonParser, async (req: any, res: any) => {
  let uid: string;

  const userToken = req?.body?.token;
  if (!userToken) {
    console.log("missing auth token");
    res.send({
      success: false,
      reason: "missing auth token",
    });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(userToken);
    uid = decodedToken.uid;
    const user = await auth.getUser(uid);
    const roles = user?.customClaims?.roles;
    if (!roles || !Array.isArray(roles) || !roles?.includes("ADMIN")) {
      logErrorToDB(`user is not admin, uid: ${uid}`, uid);
      res.send({
        success: false,
        reason: `user is not admin`,
      });
      return;
    }
    console.log("successfully authenticated");
  } catch (error) {
    logErrorToDB(`error verifying auth token: ${error}`, uid);
    res.send({
      success: false,
      reason: `error verifying auth token: ${error}`,
    });
    return;
  }

  const configPath = req?.body?.configPath;
  console.log("configPath:", configPath);

  if (!configPath) {
    res.send({
      success: false,
      reason: "invalid configPath",
    });
  }

  await generateConfig(configPath, uid);

  console.log("generateConfig done");

  let hasEnvError = false;
  if (!process.env._FIREBASE_TOKEN) {
    logErrorToDB(
      `Invalid env: _FIREBASE_TOKEN (${process.env._FIREBASE_TOKEN})`,
      uid
    );
    hasEnvError = true;
  }

  if (!process.env._PROJECT_ID) {
    logErrorToDB(`Invalid env: _PROJECT_ID (${process.env._PROJECT_ID})`, uid);
    hasEnvError = true;
  }

  await asyncExecute(
    `asdgiohiusdfgoj; \
     asdfasdfjnjia`,
    commandErrorHandler,
    uid
  );

  await asyncExecute(
    `cd build/functions; \
     yarn install`,
    commandErrorHandler,
    uid
  );

  if (!hasEnvError) {
    await asyncExecute(
      `cd build/functions; \
       yarn deployFT \
        --project ${process.env._PROJECT_ID} \
        --token ${process.env._FIREBASE_TOKEN} \
        --only functions`,
      commandErrorHandler,
      uid
    );
  } else {
    console.warn("deployFT did not run. Check env variables first.");
  }

  res.send({
    success: true,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
