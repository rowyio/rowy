import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:9299";

const projectId = "rowy-os-testing";

export const app = initializeApp({ projectId });
export const auth = getAuth();
export const firestore = getFirestore(app);
export const events = [] as any;

export const listen = async () => {
  console.log(firestore);
  const collections = await firestore.listCollections();
  console.log("collections: ", collections);

  firestore.doc("").onSnapshot((snapshot) => {
    console.log("on snapshot: ", snapshot.data());
    events.push({ ref: snapshot.ref, data: snapshot.data() as any });
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
