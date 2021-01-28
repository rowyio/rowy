import * as admin from "firebase-admin";

const fieldValue = admin.firestore.FieldValue;
import { db } from "../firebaseConfig";
const TARGET_SUB_COLLECTION = "_FT_BINDINGS";
//sample bindings document

// /_FT_BINDINGS/{docId}
// docId is encodeURIComponent of docPath
/**
 
{
    [targetCollectionName]:{
      [targetField]:{
        trackedFields:[]
        targets{
          [docId]:true
        }
      }
    }
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
  db.doc(`${TARGET_SUB_COLLECTION}/${encodeURIComponent(sourceDocPath)}`).set(
    {
      [encodeURIComponent(targetRef.parent.path)]: {
        [targetFieldKey]: {
          trackedFields,
          targets: { [targetRef.id]: true },
        },
      },
    },
    { merge: true }
  );

// remove propagation reference from source subcollection
export const removeTargetRef = (
  targetRef: FirebaseFirestore.DocumentReference,
  sourceDocPath: string,
  targetFieldKey: string
) =>
  db.doc(`${TARGET_SUB_COLLECTION}/${encodeURIComponent(sourceDocPath)}`).set(
    {
      [encodeURIComponent(targetRef.parent.path)]: {
        [targetFieldKey]: {
          targets: { [targetRef.id]: fieldValue.delete() },
        },
      },
    },
    { merge: true }
  );

// db
// .doc(`${sourceDocPath}/${TARGET_SUB_COLLECTION}/${encodeURIComponent(targetRef.parent.path)}`)
// .set({ [targetFieldKey]:{targets:{[targetRef.id]:fieldValue.delete()}}},{merge: true});
// new Promise((resolve, reject) => db
//   .collection(`${sourceDocPath}/${TARGET_SUB_COLLECTION}`)
//   .where("targetRef", "==", targetRef)
//   .where("targetFieldKey","==",targetFieldKey)
//   .get()
//   .then((queryResult) => resolve(Promise.all(queryResult.docs.map((doc) => doc.ref.delete())))));

// removes all references of deleted targets
export const removeRefsOnTargetDelete = (
  targetRef: FirebaseFirestore.DocumentReference,
  targetFieldKey: string
) =>
  new Promise((resolve, reject) =>
    db
      .collection(TARGET_SUB_COLLECTION)
      .where(
        `${targetRef.parent.path}.${targetFieldKey}.targets.${targetRef.id}`,
        "==",
        true
      )
      .get()
      .then((queryResult) =>
        resolve(
          Promise.all(
            queryResult.docs.map((doc) =>
              doc.ref.set(
                {
                  [encodeURIComponent(targetRef.parent.path)]: {
                    [targetFieldKey]: {
                      targets: { [targetRef.id]: fieldValue.delete() },
                    },
                  },
                },
                { merge: true }
              )
            )
          )
        )
      )
  );
