import { useEffect } from "react";
import { useAtom, PrimitiveAtom, useSetAtom } from "jotai";
import { Scope } from "jotai/core/atom";
import { RESET } from "jotai/utils";
import {
  query,
  collection,
  where,
  orderBy,
  DocumentData,
  onSnapshot,
  FirestoreError,
  setDoc,
  doc,
  CollectionReference,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { globalScope } from "@src/atoms/globalScope";
import {
  UpdateCollectionFunction,
  TableFilter,
  TableOrder,
} from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

/** Options for {@link useFirestoreCollectionWithAtom} */
interface IUseFirestoreCollectionWithAtomOptions<T> {
  /** Additional path segments appended to the path. If any are undefined, the listener isn’t created at all. */
  pathSegments?: Array<string | undefined>;
  /** Attach filters to the query */
  filters?: TableFilter[];
  /** Attach orders to the query */
  orders?: TableOrder[];
  /** Called when an error occurs. Make sure to wrap in useCallback! If not provided, errors trigger the nearest ErrorBoundary. */
  onError?: (error: FirestoreError) => void;
  /** Optionally disable Suspense */
  disableSuspense?: boolean;
  /** Set this atom’s value to a function that updates the document. Uses same scope as `dataScope`. */
  updateDataAtom?: PrimitiveAtom<UpdateCollectionFunction<T> | null>;
}

/**
 * Attaches a listener for a Firestore collection and unsubscribes on unmount.
 * Gets the Firestore instance initiated in globalScope.
 * Updates an atom and Suspends that atom until the first snapshot is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Collection path. If falsy, the listener isn’t created at all.
 * @param options - {@link IUseFirestoreCollectionWithAtomOptions}
 */
export function useFirestoreCollectionWithAtom<T = DocumentData>(
  dataAtom: PrimitiveAtom<T[]>,
  dataScope: Scope | undefined,
  path: string | undefined,
  options?: IUseFirestoreCollectionWithAtomOptions<T>
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
    filters,
    orders,
    onError,
    disableSuspense,
    updateDataAtom,
  } = options || {};

  useEffect(() => {
    if (!path || (Array.isArray(pathSegments) && pathSegments.some((x) => !x)))
      return;

    let suspended = false;

    // Suspend data atom until we get the first snapshot
    if (!disableSuspense) {
      setDataAtom(new Promise(() => {}) as unknown as T[]);
      suspended = true;
    }

    // Create a collection reference to use in `updateDataAtom`
    const collectionRef = collection(
      firebaseDb,
      path,
      ...((pathSegments as string[]) || [])
    ) as CollectionReference<T>;
    // Create the query with filters and orders
    const _query = query<T>(
      collectionRef,
      ...(filters?.map((filter) =>
        where(filter.key, filter.operator, filter.value)
      ) || []),
      ...(orders?.map((order) => orderBy(order.key, order.direction)) || [])
    );

    const unsubscribe = onSnapshot(
      _query,
      (querySnapshot) => {
        try {
          // Extract doc data from query
          // and add `_rowy_id` and `_rowy_ref` fields
          const docs = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            _rowy_id: doc.id,
            _rowy_ref: doc.ref,
          }));
          setDataAtom(docs);
        } catch (error) {
          if (onError) onError(error as FirestoreError);
          else handleError(error);
        }
        suspended = false;
      },
      (error) => {
        if (suspended) setDataAtom([]);
        if (onError) onError(error);
        else handleError(error);
      }
    );

    // If `options?.updateDataAtom` was passed,
    // set the atom’s value to a function that updates the document
    if (updateDataAtom) {
      setUpdateDataAtom(
        () => (path: string, update: T) =>
          setDoc(doc(collectionRef, path), update, { merge: true })
      );
    }

    return () => {
      unsubscribe();
      // If `options?.updateDataAtom` was passed,
      // reset the atom’s value to prevent writes
      if (updateDataAtom) setUpdateDataAtom(RESET);
    };
  }, [
    firebaseDb,
    path,
    pathSegments,
    filters,
    orders,
    onError,
    setDataAtom,
    disableSuspense,
    handleError,
    updateDataAtom,
    setUpdateDataAtom,
  ]);
}

export default useFirestoreCollectionWithAtom;
