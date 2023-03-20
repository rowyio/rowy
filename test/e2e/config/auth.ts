import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { writeFileSync } from "fs";

const WebSocketClient = require("websocket").client;

const client = new WebSocketClient();

client.on("connect", function (connection: any) {
  console.log("WebSocket Client Connected");
  connection.on("error", function (error: any) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on("close", function () {
    console.log("echo-protocol Connection Closed");
  });
  connection.on("message", function (message: any) {
    const { rulesContext } = JSON.parse(message.utf8Data);
    if (rulesContext) {
      const { path = [], method } = rulesContext;
      console.log(`${method} ${path.split("/").slice(4).join("/")}`);
    }
  });
});

client.connect("ws://localhost:9150/requests");

process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:9299";

const projectId = "rowy-os-testing";

export const app = initializeApp({ projectId });
export const auth = getAuth();
export const firestore = getFirestore(app);

export const recordChanges = async (filename: string) => {
  const collections = await firestore.listCollections();
  return firestore.doc("_rowy_/settings").onSnapshot((snapshot) => {
    writeFileSync(filename, `${snapshot.data()}`);
    console.log("write into: ", filename);
  });
};

export const getAuthToken = async (email: string) => {
  try {
    const user = await auth.getUserByEmail(email);
    const token = await auth.createCustomToken(user.uid);
    return token;
  } catch (e) {
    console.error(`User with ${email}, not found!`);
  }
  return;
};

export const listUsers = async () => {
  const users = await auth.listUsers();
  return users;
};
