const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
import { asyncExecute } from "./compiler/terminal";
import generateConfig from "./compiler";
import { auth } from "./firebaseConfig";
import meta from "./package.json";
import { commandErrorHandler, logErrorToDB } from "./utils";
const fs = require("fs");
const path = require("path");
import firebase from "firebase-admin";

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

app.get("/", async (req: any, res: any) => {
  res.send(`Firetable cloud function builder version ${meta.version}`);
});

app.post("/", jsonParser, async (req: any, res: any) => {
  let user: firebase.auth.UserRecord;

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
    const uid = decodedToken.uid;
    user = await auth.getUser(uid);
    const roles = user?.customClaims?.roles;
    if (!roles || !Array.isArray(roles) || !roles?.includes("ADMIN")) {
      await logErrorToDB({
        errorDescription: `user is not admin`,
        user,
      });
      res.send({
        success: false,
        reason: `user is not admin`,
      });
      return;
    }
    console.log("successfully authenticated");
  } catch (error) {
    await logErrorToDB({
      errorDescription: `error verifying auth token: ${error}`,
      user,
    });
    res.send({
      success: false,
      reason: `error verifying auth token: ${error}`,
    });
    return;
  }

  const configPath = req?.body?.configPath;
  console.log("configPath:", configPath);

  if (!configPath) {
    await logErrorToDB({
      errorDescription: `Invalid configPath (${configPath})`,
      user,
    });
    res.send({
      success: false,
      reason: "invalid configPath",
    });
  }

  const success = await generateConfig(configPath, user);
  if (!success) {
    console.log(`generateConfig failed to complete`);
    res.send({
      success: false,
      reason: `generateConfig failed to complete`,
    });
    return;
  }

  try {
    const configFile = fs.readFileSync(
      path.resolve(__dirname, "./functions/src/functionConfig.ts"),
      "utf-8"
    );
  } catch (e) {
    await logErrorToDB({
      errorDescription: `Error reading compiled functionConfig.ts`,
      user,
    });
  }

  console.log("generateConfig done");

  let hasEnvError = false;
  if (!process.env._FIREBASE_TOKEN) {
    await logErrorToDB({
      errorDescription: `Invalid env: _FIREBASE_TOKEN (${process.env._FIREBASE_TOKEN})`,
      user,
    });
    hasEnvError = true;
  }

  if (!process.env._PROJECT_ID) {
    await logErrorToDB({
      errorDescription: `Invalid env: _PROJECT_ID (${process.env._PROJECT_ID})`,
      user,
    });
    hasEnvError = true;
  }

  await asyncExecute(
    `cd build/functions; \
     yarn install`,
    commandErrorHandler({ user })
  );

  if (!hasEnvError) {
    await asyncExecute(
      `cd build/functions; \
       yarn deployFT \
        --project ${process.env._PROJECT_ID} \
        --token ${process.env._FIREBASE_TOKEN} \
        --only functions`,
      commandErrorHandler({ user })
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
  console.log(
    `Firetable cloud function builder ${meta.version}: listening on port ${port}`
  );
});
