import { useEffect } from "react";
import { useAtom, PrimitiveAtom, useSetAtom } from "jotai";
import { Scope } from "jotai/core/atom";
import {
  doc,
  onSnapshot,
  FirestoreError,
  setDoc,
  DocumentReference,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { globalScope } from "@src/atoms/globalScope";
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
 * Gets the Firestore instance initiated in globalScope.
 * Updates an atom and Suspends that atom until the first snapshot is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Document path. If falsy, the listener isn’t created at all.
 * @param options - {@link IUseFirestoreDocWithAtomOptions}
 */
export function useFirestoreDocWithAtom<T = TableRow>(
  dataAtom: PrimitiveAtom<T>,
  dataScope: Scope | undefined,
  path: string | undefined,
  options?: IUseFirestoreDocWithAtomOptions<T>
) {
  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const setDataAtom = useSetAtom(dataAtom, dataScope);
  const setUpdateDataAtom = useSetAtom(
    options?.updateDataAtom || (dataAtom as any),
    globalScope
  );
  const handleError = useErrorHandler();

  // Destructure options so they can be used as useEffect dependencies
  const {
    pathSegments,
    onError,
    disableSuspense,
    createIfNonExistent,
    updateDataAtom,
  } = options || {};

  useEffect(() => {
    if (!path || (Array.isArray(pathSegments) && pathSegments.some((x) => !x)))
      return;

    let suspended = false;

    // Suspend data atom until we get the first snapshot
    if (!disableSuspense) {
      setDataAtom(new Promise(() => {}) as unknown as T);
      suspended = true;
    }

    const ref = doc(
      firebaseDb,
      path,
      ...((pathSegments as string[]) || [])
    ) as DocumentReference<T>;

    const unsubscribe = onSnapshot(
      ref,
      (docSnapshot) => {
        try {
          if (!docSnapshot.exists() && !!createIfNonExistent) {
            setDoc(docSnapshot.ref, createIfNonExistent);
            setDataAtom(createIfNonExistent);
          } else {
            setDataAtom(docSnapshot.data() || ({} as T));
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

    // If `options?.updateDataAtom` was passed,
    // set the atom’s value to a function that updates the document
    if (updateDataAtom) {
      setUpdateDataAtom(
        () => (update: T) => setDoc(ref, update, { merge: true })
      );
    }

    return () => {
      unsubscribe();
      // If `options?.updateDataAtom` was passed,
      // reset the atom’s value to prevent writes
      if (updateDataAtom) setUpdateDataAtom(undefined);
    };
  }, [
    firebaseDb,
    path,
    pathSegments,
    onError,
    setDataAtom,
    disableSuspense,
    createIfNonExistent,
    handleError,
    updateDataAtom,
    setUpdateDataAtom,
  ]);
}

export default useFirestoreDocWithAtom;
