import { useEffect } from "react";
import { useAtom, PrimitiveAtom, useSetAtom } from "jotai";
import { Scope } from "jotai/core/atom";
import { RESET } from "jotai/utils";
import {
  query,
  collection,
  collectionGroup as queryCollectionGroup,
  limit as queryLimit,
  where,
  orderBy,
  onSnapshot,
  FirestoreError,
  setDoc,
  doc,
  CollectionReference,
  Query,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { globalScope } from "@src/atoms/globalScope";
import {
  UpdateCollectionFunction,
  TableFilter,
  TableOrder,
  TableRow,
} from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

export const DEFAULT_COLLECTION_QUERY_LIMIT = 50;

/** Options for {@link useFirestoreCollectionWithAtom} */
interface IUseFirestoreCollectionWithAtomOptions<T> {
  /** Additional path segments appended to the path. If any are undefined, the listener isn’t created at all. */
  pathSegments?: Array<string | undefined>;
  /** Optionally use a collection group query get all documents from collections with the same name as the `path` prop */
  collectionGroup?: boolean;
  /** Attach filters to the query */
  filters?: TableFilter[];
  /** Attach orders to the query */
  orders?: TableOrder[];
  /** Limit query */
  limit?: number;
  /** Called when an error occurs. Make sure to wrap in useCallback! If not provided, errors trigger the nearest ErrorBoundary. */
  onError?: (error: FirestoreError) => void;
  /** Optionally disable Suspense */
  disableSuspense?: boolean;
  /** Set this atom’s value to a function that updates a document in the collection. If `collectionGroup` is true, you must pass the full path. Uses same scope as `dataScope`. */
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
export function useFirestoreCollectionWithAtom<T = TableRow>(
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
    collectionGroup,
    filters,
    orders,
    limit = DEFAULT_COLLECTION_QUERY_LIMIT,
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

    // Create a collection or collection group reference
    // to query data and to use in `updateDataAtom`
    const collectionRef = collectionGroup
      ? (queryCollectionGroup(
          firebaseDb,
          [path, ...((pathSegments as string[]) || [])].join("/")
        ) as Query<T>)
      : (collection(
          firebaseDb,
          path,
          ...((pathSegments as string[]) || [])
        ) as CollectionReference<T>);
    // Create the query with filters and orders
    const _query = query<T>(
      collectionRef,
      queryLimit(limit),
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
    // set the atom’s value to a function that updates a doc in the collection
    if (updateDataAtom) {
      setUpdateDataAtom(
        () => (path: string, update: T) =>
          setDoc(
            collectionGroup
              ? doc(firebaseDb, path)
              : doc(collectionRef as CollectionReference<T>, path),
            update,
            { merge: true }
          )
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
    collectionGroup,
    filters,
    orders,
    limit,
    onError,
    setDataAtom,
    disableSuspense,
    handleError,
    updateDataAtom,
    setUpdateDataAtom,
  ]);
}

export default useFirestoreCollectionWithAtom;
