import { firestore, Change, auth as FCAuth } from "firebase-functions";
import { auth, db } from "../config";

export interface PermissionsConfig {
  name: string;
  customTokenFields: string[];
}

const email2uid = async (email: string) => {
  const user = await auth.getUserByEmail(email);
  console.log(
    `${email} previous customClaims ${JSON.stringify(user.customClaims)}`
  );
  return user ? user.uid : undefined;
};

const setClaims = async (
  uid: string,
  doc: any,
  customClaimsFields: string[]
) => {
  const customClaimsTokens = customClaimsFields.reduce(
    (token: any, currentField: string) => {
      if (doc[currentField])
        return { ...token, [currentField]: doc[currentField] };
      else return token;
    },
    {}
  );

  await auth
    .setCustomUserClaims(uid, customClaimsTokens)
    .catch(err => console.log(err))
    .then(() => {
      console.info(
        `${uid} has new claims ${JSON.stringify(customClaimsTokens)}`
      );
    })
    .catch(() => "obligatory catch");
  return true;
};
export const onSignup = (
  collectionName: string,
  customTokenFields: string[]
) => async (user: FCAuth.UserRecord) => {
  if (user.emailVerified) {
    const email = user.email;
    const invites = await db
      .collection(collectionName)
      .where("email", "==", email)
      .get();
    if (invites.docs.length === 0) {
      console.log("no invites found");
      return false;
    }

    const inviteData = invites.docs[0].data();
    await setClaims(user.uid, inviteData, customTokenFields);
    return true;
  }
  console.error("email not verified on signup");
  return false;
};

const permissions = (customClaimsFields: string[]) => async (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const docData = snapshot.data();
  if (!docData) {
    console.log("no after Data");
    return false;
  }
  const { email } = docData;
  if (!email) {
    console.warn(`row has no email`);
    return false;
  }
  const uid = await email2uid(email);
  if (!uid) {
    console.warn(`user ${uid} does not exist`);
    return false;
  }
  await setClaims(uid, docData, customClaimsFields);
  return true;
};

const permissionsFnsGenerator = (collection: PermissionsConfig) => ({
  onCreate: firestore
    .document(`${collection.name}/{docId}`)
    .onCreate(permissions(collection.customTokenFields)),
  onUpdate: firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate((change: Change<FirebaseFirestore.DocumentSnapshot>) =>
      permissions(collection.customTokenFields)(change.after)
    ),
  onSignup: FCAuth.user().onCreate(
    onSignup(collection.name, collection.customTokenFields)
  ),
});

export default permissionsFnsGenerator;
