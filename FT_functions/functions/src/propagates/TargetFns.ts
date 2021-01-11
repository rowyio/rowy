import { db } from "../firebaseConfig";
const TARGET_SUB_COLLECTION = "_FT_TARGETS";

//sample target sub document

// {collection**}/
/**
 
{
    targetRef:'test/id'
    targetFieldKey:'fieldKey'
    trackedFields:[]
}
 */

// Target changes Trigger

// add propagation reference from source subcollection
export const addTargetRef = (
  targetRef: FirebaseFirestore.DocumentReference,
  sourceDocPath: string,
  targetFieldKey: string,
  trackedFields
) =>
  db
    .collection(`${sourceDocPath}/${TARGET_SUB_COLLECTION}`)
    .add({ targetRef, targetFieldKey, trackedFields });

// remove propagation reference from source subcollection
export const removeTargetRef = (
  targetRef: FirebaseFirestore.DocumentReference,
  sourceDocPath: string
) =>
  db
    .collection(`${sourceDocPath}/${TARGET_SUB_COLLECTION}`)
    .where("targetRef", "==", targetRef)
    .get()
    .then((queryResult) => queryResult.docs.map((doc) => doc.ref.delete()));

// removes all references of deleted targets
export const removeAllReferencesOnTargetDelete = (
  targetDocRef: FirebaseFirestore.DocumentReference
) =>
  db
    .collectionGroup(TARGET_SUB_COLLECTION)
    .where("targetRef", "==", targetDocRef)
    .get()
    .then((queryResult) => queryResult.docs.map((doc) => doc.ref.delete()));
