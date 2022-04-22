import { useEffect } from "react";
import { useAtom, PrimitiveAtom } from "jotai";
import { Scope } from "jotai/core/atom";
import { useUpdateAtom } from "jotai/utils";
import {
  doc,
  DocumentData,
  onSnapshot,
  FirestoreError,
} from "firebase/firestore";

import { globalScope } from "@src/atoms/globalScope";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

/**
 * Attaches a listener for Firestore documents and unsubscribes on unmount.
 * Gets the Firestore instance initiated in globalScope.
 * Updates an atom and suspends that atom until the first snapshot is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Document path
 * @param pathSegments - Additional path segments appended to the path
 * @param onError - Called when an error occurs. Make sure to wrap in useCallback!
 */
export default function useFirestoreDocWithAtom(
  dataAtom: PrimitiveAtom<DocumentData>,
  dataScope: Scope | undefined,
  path: string | undefined,
  pathSegments?: Array<string | undefined>,
  onError?: (error: FirestoreError) => void
) {
  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const setDataAtom = useUpdateAtom(dataAtom, dataScope);

  useEffect(() => {
    if (!path || (Array.isArray(pathSegments) && pathSegments.some((x) => !x)))
      return;

    // Suspend data atom until we get the first snapshot
    setDataAtom(new Promise(() => {}));

    const unsubscribe = onSnapshot(
      doc(firebaseDb, path, ...((pathSegments as string[]) || [])),
      (doc) => {
        setDataAtom(doc.data()!);
      },
      onError
    );

    return () => {
      unsubscribe();
    };
  }, [firebaseDb, path, pathSegments, onError, setDataAtom]);
}
