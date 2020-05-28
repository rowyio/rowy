import * as functions from "firebase-functions";

import { db } from "../config";

type synonymGroup = {
  isForced: boolean | undefined;
  listenerField: string;
  synonymField: string;
  transformer: Function;
};

const synonyms = (docData, groups: synonymGroup[]) =>
  groups.reduce(async (acc: any, currGroup) => {
    const newValue = await currGroup.transformer(
      docData[currGroup.listenerField],
      docData
    );
    if (
      docData[currGroup.listenerField] &&
      docData[currGroup.synonymField] !== newValue
    ) {
      return {
        ...(await acc),
        [currGroup.synonymField]: newValue,
      };
    } else return await acc;
  }, {});

/**
 *
 */
const addSynonymOnUpdate = (groups: synonymGroup[]) => async (
  change: functions.Change<FirebaseFirestore.DocumentSnapshot>
) => {
  const beforeData = change.before.data();
  const afterData = change.after.data();

  if (!beforeData || !afterData) {
    return false;
  }
  const changedGroups = groups.reduce((acc: synonymGroup[], currGroup) => {
    if (
      currGroup.isForced ||
      beforeData[currGroup.listenerField] !== afterData[currGroup.listenerField]
    ) {
      return [...acc, currGroup];
    } else {
      return acc;
    }
  }, []);
  if (changedGroups.length === 0) {
    return false; // no changes detected
  }
  const updates = await synonyms(
    { ...afterData, id: change.after.id },
    changedGroups
  );
  if (Object.values(updates).length === 0) {
    return false;
  } else {
    const docPath = change.after.ref.path;
    return db.doc(docPath).update(updates);
  }
};

const addSynonymOnCreate = (groups: synonymGroup[]) => async (
  snapshot: FirebaseFirestore.DocumentSnapshot
) => {
  const docData = snapshot.data();
  if (!docData) {
    return false;
  }
  const updates = await synonyms({ ...docData, id: snapshot.id }, groups);
  if (Object.keys(updates).length === 0) {
    return false;
  } else {
    const docPath = snapshot.ref.path;
    return db.doc(docPath).update(updates);
  }
};

/**
 *
 * @param collection configuration object
 */
const synonymsFnsGenerator = collection => ({
  onCreate: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onCreate(addSynonymOnCreate(collection.groups)),
  onUpdate: functions.firestore
    .document(`${collection.name}/{docId}`)
    .onUpdate(addSynonymOnUpdate(collection.groups)),
});

export default synonymsFnsGenerator;
