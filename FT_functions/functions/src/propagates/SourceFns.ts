import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { rowReducer } from "../utils";
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

// source changes Trigger

// check and propagate any tracked changes to
export const propagateChanges = (docSnapshot: DocumentSnapshot) =>
  docSnapshot.ref
    .collection(TARGET_SUB_COLLECTION)
    .get()
    .then((queryResult) => {
      queryResult.docs.map(async (doc) => {
        const { targetRef, targetFieldKey, trackedFields } = doc.data() as {
          targetRef: FirebaseFirestore.DocumentReference;
          targetFieldKey: string;
          trackedFields: string[];
        };
        const targetDoc = await targetRef.get();
        if (!targetDoc.exists) return false;
        const targetFieldValue = targetDoc.get(targetFieldKey);
        const indexOfCurrentTarget = targetFieldValue.findIndex(
          (element) => element.docPath === docSnapshot.ref.path
        );
        if (indexOfCurrentTarget > -1) {
          targetFieldValue[indexOfCurrentTarget].snapshot = rowReducer(
            trackedFields,
            docSnapshot.data()
          );
          await targetRef.update({ [targetFieldKey]: targetFieldValue });
          return true;
        } else return false;
      });
    });

// when deleting a document all snapshot copies of it in
export const removeCopiesOfDeleteDoc = (
  sourceDocRef: FirebaseFirestore.DocumentReference
) =>
  sourceDocRef
    .collection(TARGET_SUB_COLLECTION)
    .get()
    .then((queryResult) => {
      queryResult.docs.map(async (doc) => {
        const { targetRef, targetFieldKey } = doc.data() as {
          targetRef: FirebaseFirestore.DocumentReference;
          targetFieldKey: string;
        };
        const targetDoc = await targetRef.get();
        const currentTargetFieldValue = targetDoc.get(targetFieldKey);
        const newTargetFieldValue = currentTargetFieldValue.filter(
          ({ docPath }: { docPath: string; snapshot: any }) =>
            docPath !== sourceDocRef.path
        );
        await targetRef.update({ [targetFieldKey]: newTargetFieldValue });
        await doc.ref.delete();
      });
    });
