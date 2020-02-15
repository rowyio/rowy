import { firestore } from "firebase-functions";
import { auth } from "../config";
const email2uid = async (email: string) => {
  const user = await auth.getUserByEmail(email);
  console.log(
    `${email} previous customClaims ${JSON.stringify(user.customClaims)}`
  );
  return user ? user.uid : undefined;
};

const permissions = (customClaimsFields: string[]) => async change => {
  const after = change.after;
  const afterData = after.data();
  if (!afterData) {
    console.log("no after Data");
    return false;
  }
  const { email } = afterData;
  if (!email) {
    console.warn(`row has no email`);
    return false;
  }
  const uid = await email2uid(email);
  const customClaimsTokens = customClaimsFields.reduce(
    (token: any, currentField: string) => {
      if (afterData[currentField])
        return { ...token, [currentField]: afterData[currentField] };
      else return token;
    },
    {}
  );
  if (uid) {
    await auth
      .setCustomUserClaims(uid, customClaimsTokens)
      .catch(err => console.log(err))
      .then(() => {
        console.info(
          `${email} has new claims ${JSON.stringify(customClaimsTokens)}`
        );
      })
      .catch(() => "obligatory catch");
    return true;
  } else {
    console.warn(`user with email ${email} does not exist`);
    return false;
  }
};

const permissionsFnsGenerator = collection =>
  firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(permissions(collection.customTokenFields));

export default permissionsFnsGenerator;
