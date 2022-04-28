import { useEffect } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { Scope } from "jotai/core/atom";
import { useUpdateAtom } from "jotai/utils";
import {
  doc,
  DocumentData,
  onSnapshot,
  FirestoreError,
  setDoc,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { globalScope } from "@src/atoms/globalScope";
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
}

/**
 * Attaches a listener for Firestore documents and unsubscribes on unmount.
 * Gets the Firestore instance initiated in globalScope.
 * Updates an atom and optionally Suspends that atom until the first snapshot
 * is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Document path. If falsy, the listener isn’t created at all.
 * @param options - {@link IUseFirestoreDocWithAtomOptions}
 */
export function useFirestoreDocWithAtom<T = DocumentData>(
  dataAtom: PrimitiveAtom<DocumentData>,
  dataScope: Scope | undefined,
  path: string | undefined,
  options?: IUseFirestoreDocWithAtomOptions<T>
) {
  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const setDataAtom = useUpdateAtom(dataAtom, dataScope);
  const handleError = useErrorHandler();

  // Destructure options so they can be used as useEffect dependencies
  const { pathSegments, onError, disableSuspense, createIfNonExistent } =
    options || {};

  useEffect(() => {
    if (!path || (Array.isArray(pathSegments) && pathSegments.some((x) => !x)))
      return;

    let suspended = false;

    // Suspend data atom until we get the first snapshot
    if (!disableSuspense) {
      setDataAtom(new Promise(() => {}));
      suspended = true;
    }

    const unsubscribe = onSnapshot(
      doc(firebaseDb, path, ...((pathSegments as string[]) || [])),
      (doc) => {
        try {
          if (!doc.exists() && !!createIfNonExistent) {
            setDoc(doc.ref, createIfNonExistent);
            setDataAtom(createIfNonExistent);
          } else {
            setDataAtom(doc.data() || {});
          }
        } catch (error) {
          if (onError) onError(error as FirestoreError);
          else handleError(error);
        }
        suspended = false;
      },
      (error) => {
        if (suspended) setDataAtom({});
        if (onError) onError(error);
        else handleError(error);
      }
    );

    return () => {
      unsubscribe();
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
  ]);
}

export default useFirestoreDocWithAtom;
