import { useEffect } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, PrimitiveAtom, useSetAtom } from "jotai";
import { set } from "lodash-es";
import { useSnackbar } from "notistack";

import {
  Firestore,
  doc,
  refEqual,
  onSnapshot,
  FirestoreError,
  setDoc,
  DocumentReference,
  deleteField,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { projectScope } from "@src/atoms/projectScope";
import { UpdateDocFunction, TableRow } from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

/** Options for {@link useFirestoreDocWithAtom} */
interface IUseFirestoreDocWithAtomOptions<T> {
  /** Additional path segments appended to the path. If any are undefined, the listener isn’t created at all. */
  pathSegments?: Array<string | undefined>;
  /** Called when an error occurs. Make sure to wrap in useCallback! If not provided, errors trigger the nearest ErrorBoundary. */
  onError?: (error: FirestoreError) => void;
  /** Optionally disable Suspense */
  disableSuspense?: boolean;
  /** Optionally create the document if it doesn’t exist with the following data */
  createIfNonExistent?: T;
  /** Set this atom’s value to a function that updates the document. Uses same scope as `dataScope`. */
  updateDataAtom?: PrimitiveAtom<UpdateDocFunction<T> | undefined>;
}

/**
 * Attaches a listener for a Firestore document and unsubscribes on unmount.
 * Gets the Firestore instance initiated in projectScope.
 * Updates an atom and Suspends that atom until the first snapshot is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Document path. If falsy, the listener isn’t created at all.
 * @param options - {@link IUseFirestoreDocWithAtomOptions}
 */
export function useFirestoreDocWithAtom<T = TableRow>(
  dataAtom: PrimitiveAtom<T>,
  dataScope: Parameters<typeof useAtom>[1] | undefined,
  path: string | undefined,
  options?: IUseFirestoreDocWithAtomOptions<T>
) {
  // Destructure options so they can be used as useEffect dependencies
  const {
    pathSegments,
    onError,
    disableSuspense,
    createIfNonExistent,
    updateDataAtom,
  } = options || {};

  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const setDataAtom = useSetAtom(dataAtom, dataScope);
  const setUpdateDataAtom = useSetAtom(
    options?.updateDataAtom || (dataAtom as any),
    dataScope
  );
  const handleError = useErrorHandler();
  const { enqueueSnackbar } = useSnackbar();

  // Create the doc ref and memoize using Firestore’s refEqual
  const memoizedDocRef = useMemoValue(
    getDocRef<T>(firebaseDb, path, pathSegments),
    (next, prev) => refEqual(next as any, prev as any)
  );

  useEffect(() => {
    // If path is invalid and no memoizedDocRef was created, don’t continue
    if (!memoizedDocRef) return;

    // Suspend data atom until we get the first snapshot
    let suspended = false;
    if (!disableSuspense) {
      setDataAtom(new Promise(() => {}) as unknown as T);
      suspended = true;
    }

    // Create a listener for the document
    const unsubscribe = onSnapshot(
      memoizedDocRef,
      { includeMetadataChanges: true },
      (docSnapshot) => {
        try {
          // If doc doesn’t exist, set data atom to default value
          // But don’t create a new document in db, since this has previously
          // caused documents to be reset, and the bug is hard to reproduce.
          // Instead, when the user updates the document, it will be created.
          if (!docSnapshot.exists() && !!createIfNonExistent) {
            // Temporarily set the data atom to the default data
            setDataAtom({ ...createIfNonExistent, _rowy_ref: docSnapshot.ref });
          } else {
            setDataAtom({
              ...(docSnapshot.data() as T),
              _rowy_ref: docSnapshot.ref,
            });
          }
        } catch (error) {
          if (onError) onError(error as FirestoreError);
          else handleError(error);
        }
        suspended = false;
      },
      (error) => {
        if (suspended) setDataAtom({} as T);
        if (onError) onError(error);
        else handleError(error);
      }
    );

    // When the listener will change, unsubscribe
    return () => {
      unsubscribe();
    };
  }, [
    memoizedDocRef,
    onError,
    setDataAtom,
    disableSuspense,
    createIfNonExistent,
    handleError,
  ]);

  // Set updateDocAtom and deleteDocAtom values if they exist
  useEffect(() => {
    // If path is invalid and no memoizedDocRef was created,
    // don’t set update and delete atoms
    if (!memoizedDocRef) return;

    // If `updateDataAtom` was passed,
    // set the atom’s value to a function that updates the document
    if (updateDataAtom) {
      setUpdateDataAtom(() => (update: T, deleteFields?: string[]) => {
        const updateToDb = { ...update };

        if (Array.isArray(deleteFields)) {
          for (const field of deleteFields) {
            set(updateToDb as any, field, deleteField());
          }
        }

        return setDoc(memoizedDocRef, updateToDb, { merge: true }).catch(
          (e) => {
            enqueueSnackbar((e as Error).message, { variant: "error" });
          }
        );
      });
    }

    return () => {
      // If `updateDataAtom` was passed,
      // reset the atom’s value to prevent writes
      if (updateDataAtom) setUpdateDataAtom(undefined);
    };
  }, [memoizedDocRef, updateDataAtom, setUpdateDataAtom, enqueueSnackbar]);
}

export default useFirestoreDocWithAtom;

/**
 * Create the Firestore document reference.
 * Put code in a function so the results can be compared by useMemoValue.
 */
export const getDocRef = <T>(
  firebaseDb: Firestore,
  path: string | undefined,
  pathSegments?: Array<string | undefined>
) => {
  if (!path || (Array.isArray(pathSegments) && pathSegments?.some((x) => !x)))
    return null;

  return doc(
    firebaseDb,
    path,
    ...((pathSegments as string[]) || [])
  ) as DocumentReference<T>;
};
