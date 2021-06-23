const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
import { asyncExecute } from "./compiler/terminal";
import { createStreamLogger } from "./utils";
import generateConfig from "./compiler";
import { auth } from "./firebaseConfig";
import meta from "./package.json";
import { commandErrorHandler, logErrorToDB } from "./utils";
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

  const streamLogger = await createStreamLogger(configPath);
  await streamLogger.info("streamLogger created");

  const success = await generateConfig(configPath, user, streamLogger);
  if (!success) {
    await streamLogger.error("generateConfig failed to complete");
    await streamLogger.fail();
    res.send({
      success: false,
      reason: `generateConfig failed to complete`,
    });
    return;
  }
  await streamLogger.info("generateConfig success");

  let hasEnvError = false;

  if (!process.env._PROJECT_ID) {
    await logErrorToDB(
      {
        errorDescription: `Invalid env: _PROJECT_ID (${process.env._PROJECT_ID})`,
        user,
      },
      streamLogger
    );
    hasEnvError = true;
  }

  if (hasEnvError) {
    await streamLogger.error("Invalid env:_PROJECT_ID");
    await streamLogger.fail();
    res.send({
      success: false,
      reason: "Invalid env:_PROJECT_ID",
    });
    return;
  }

  await asyncExecute(
    `cd build/functions; \
     yarn install`,
    commandErrorHandler({ user }, streamLogger)
  );

  await asyncExecute(
    `cd build/functions; \
       yarn deployFT \
        --project ${process.env._PROJECT_ID} \
        --only functions`,
    commandErrorHandler({ user }, streamLogger)
  );

  await streamLogger.end();
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
