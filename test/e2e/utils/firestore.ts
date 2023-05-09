import { auth, firestore } from "@e2e/config/firebase-config";
import {
  publicSettingsDoc,
  settingsDoc,
  userManagementDoc,
} from "@e2e/mocks/rowy";
import { allFieldTypesSchema } from "@e2e/mocks/table/allFieldTypes";
import { adminUser, editorUser, ownerUser } from "@e2e/mocks/users";

export const deleteCollections = async () => {
  const collections = await firestore.listCollections();
  await Promise.all(
    collections.map((collection) => firestore.recursiveDelete(collection))
  );
};

export const deleteUsers = async () => {
  return auth.deleteUsers(
    (await auth.listUsers()).users.map((user) => user.uid)
  );
};

export const initializeUsers = async () => {
  // create users
  const [owner, admin, editor] = await Promise.all([
    auth.createUser(ownerUser),
    auth.createUser(adminUser),
    auth.createUser(editorUser),
  ]);
  // set roles
  await Promise.all([
    auth.setCustomUserClaims(admin.uid, { roles: ["ADMIN"] }),
    auth.setCustomUserClaims(editor.uid, { roles: ["EDITOR"] }),
  ]);
  // set tokens as env variables
  await Promise.all([
    auth.createCustomToken(admin.uid).then((token) => {
      process.env.ADMIN_USER_TOKEN = token;
    }),
    auth.createCustomToken(editor.uid).then((token) => {
      process.env.EDITOR_USER_TOKEN = token;
    }),
  ]);

  // initialize _rowy_ collection
  await Promise.all([
    firestore.doc("_rowy_/publicSettings").create(publicSettingsDoc),
    firestore.doc("_rowy_/settings").create(settingsDoc),
    firestore.doc("_rowy_/userManagement").create(userManagementDoc),
    firestore
      .doc("_rowy_/userManagement/users/" + owner.uid)
      .create({ roles: ["OWNER"], user: ownerUser }),
    firestore
      .doc("_rowy_/userManagement/users/" + admin.uid)
      .create({ roles: ["ADMIN"], user: adminUser }),
    firestore
      .doc("_rowy_/userManagement/users/" + editor.uid)
      .create({ roles: ["EDITOR"], user: editorUser }),
    firestore
      .doc("_rowy_/settings/schema/allFieldTypes")
      .create(allFieldTypesSchema),
  ]);
};
