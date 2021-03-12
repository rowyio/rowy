const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
import { asyncExecute } from "./compiler/terminal";
import generateConfig from "./compiler";
import { auth } from "./firebaseConfig";
import meta from "./package.json";

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

app.get("/", async (req: any, res: any) => {
  res.send(`Firetable cloud function builder version ${meta.version}`);
});

app.post("/", jsonParser, async (req: any, res: any) => {
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
    const user = await auth.getUser(uid);
    const roles = user?.customClaims?.roles;
    if (!roles || !Array.isArray(roles) || !roles?.includes("ADMIN")) {
      console.log("user is not admin");
      res.send({
        success: false,
        reason: `user is not admin`,
      });
      return;
    }
    console.log("successfully authenticated");
  } catch (error) {
    console.log(`error verifying auth token: ${error}`);
    res.send({
      success: false,
      reason: `error verifying auth token: ${error}`,
    });
    return;
  }

  const configPath = req?.body?.configPath;
  console.log(configPath);

  if (!configPath) {
    res.send({
      success: false,
      reason: "invalid configPath",
    });
  }

  await generateConfig(configPath);

  console.log("generateConfig done");

  let hasEnvError = false;
  if (!process.env._FIREBASE_TOKEN) {
    console.warn("Invalid env: _FIREBASE_TOKEN");
    hasEnvError = true;
  }

  if (!process.env._PROJECT_ID) {
    console.warn("Invalid env: _PROJECT_ID");
    hasEnvError = true;
  }

  await asyncExecute(
    `cd build/functions; \
     yarn install`
  );

  if (!hasEnvError) {
    await asyncExecute(
      `cd build/functions; \
       yarn deployFT \
        --project ${process.env._PROJECT_ID} \
        --token ${process.env._FIREBASE_TOKEN} \
        --only functions`
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
