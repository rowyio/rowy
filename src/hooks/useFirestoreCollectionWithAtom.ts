import { useState, useEffect } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, PrimitiveAtom, useSetAtom, SetStateAction } from "jotai";
import { Scope } from "jotai/core/atom";
import { set } from "lodash-es";
import {
  Firestore,
  query,
  queryEqual,
  collection,
  collectionGroup as queryCollectionGroup,
  limit as queryLimit,
  where,
  orderBy,
  onSnapshot,
  FirestoreError,
  setDoc,
  doc,
  deleteDoc,
  deleteField,
  CollectionReference,
  Query,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { globalScope } from "@src/atoms/globalScope";
import {
  UpdateCollectionDocFunction,
  DeleteCollectionDocFunction,
  NextPageState,
  TableFilter,
  TableOrder,
  TableRow,
} from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";

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
  /** Set query page */
  page?: number;
  /** Set query page size */
  pageSize?: number;
  /** Called when an error occurs. Make sure to wrap in useCallback! If not provided, errors trigger the nearest ErrorBoundary. */
  onError?: (error: FirestoreError) => void;
  /** Optionally disable Suspense */
  disableSuspense?: boolean;
  /** Set this atom’s value to a function that updates a document in the collection. Must pass the full path. Uses same scope as `dataScope`. */
  updateDocAtom?: PrimitiveAtom<UpdateCollectionDocFunction<T> | undefined>;
  /** Set this atom’s value to a function that deletes a document in the collection. Must pass the full path. Uses same scope as `dataScope`. */
  deleteDocAtom?: PrimitiveAtom<DeleteCollectionDocFunction | undefined>;
  /** Update this atom when we’re loading the next page, and if there is a next page available. Uses same scope as `dataScope`. */
  nextPageAtom?: PrimitiveAtom<NextPageState>;
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
  // Destructure options so they can be used as useEffect dependencies
  const {
    pathSegments,
    collectionGroup,
    filters,
    orders,
    page = 0,
    pageSize = COLLECTION_PAGE_SIZE,
    onError,
    disableSuspense,
    updateDocAtom,
    deleteDocAtom,
    nextPageAtom,
  } = options || {};

  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const setDataAtom = useSetAtom(dataAtom, dataScope);
  const handleError = useErrorHandler();

  // Create set functions that point to optional atoms,
  // or use dataAtom if not provided. Make sure to check that the corresponding
  // option was provided before calling these functions!
  const setUpdateDocAtom = useSetAtom(
    updateDocAtom || (dataAtom as any),
    dataScope
  );
  const setDeleteDocAtom = useSetAtom(
    deleteDocAtom || (dataAtom as any),
    dataScope
  );
  const setNextPageAtom = useSetAtom<
    NextPageState,
    SetStateAction<NextPageState>,
    void
  >(nextPageAtom || (dataAtom as any), dataScope);

  // Store if we’re at the last page to prevent a new query from being created
  const [isLastPage, setIsLastPage] = useState(false);

  // Create the query and memoize using Firestore’s queryEqual
  const memoizedQuery = useMemoValue(
    getQuery<T>(
      firebaseDb,
      path,
      pathSegments,
      collectionGroup,
      page,
      pageSize,
      filters,
      orders
    ),
    (next, prev) =>
      isLastPage || queryEqual(next?.query as any, prev?.query as any)
  );

  // Create listener
  useEffect(() => {
    // If path is invalid and no memoizedQuery was created, don’t continue
    if (!memoizedQuery) return;

    // Suspend data atom until we get the first snapshot
    // Don’t suspend if we’re getting the next page
    let suspended = false;
    if (!disableSuspense && memoizedQuery.page === 0) {
      setDataAtom(new Promise(() => {}) as unknown as T[]);
      suspended = true;
    }
    // Set nextPageAtom if provided and getting the next page
    else if (memoizedQuery.page > 0 && nextPageAtom) {
      setNextPageAtom((s) => ({ ...s, loading: true }));
      console.log("Loading next page", memoizedQuery.page);
    }

    // Create a listener for the query
    const unsubscribe = onSnapshot(
      memoizedQuery.query,
      (snapshot) => {
        try {
          // Extract doc data from query and add `_rowy_ref` fields
          const docs = snapshot.docs.map((doc) => ({
            ...doc.data(),
            _rowy_ref: doc.ref,
          }));
          setDataAtom(docs);
          // If the snapshot doesn’t fill the page, it’s the last page
          if (docs.length < memoizedQuery.limit) setIsLastPage(true);
          // Update nextPageAtom if provided
          if (nextPageAtom) {
            setNextPageAtom((s) => ({
              ...s,
              loading: false,
              available: docs.length >= memoizedQuery.limit,
            }));
          }
          console.log(
            "Loaded next page",
            memoizedQuery.page,
            "  Next page available:",
            docs.length >= memoizedQuery.limit
          );
        } catch (error) {
          if (onError) onError(error as FirestoreError);
          else handleError(error);
        }
        suspended = false;
      },
      (error) => {
        if (suspended) {
          setDataAtom([]);
          suspended = false;
        }
        if (nextPageAtom) setNextPageAtom({ loading: false, available: true });
        if (onError) onError(error);
        else handleError(error);
      }
    );

    // When the listener will change, unsubscribe
    return () => {
      unsubscribe();
      if (nextPageAtom) setNextPageAtom({ loading: false, available: true });
    };
  }, [
    firebaseDb,
    memoizedQuery,
    disableSuspense,
    setDataAtom,
    onError,
    handleError,
    nextPageAtom,
    setNextPageAtom,
  ]);

  // Create variable for validity of query to pass to useEffect dependencies
  // below, and prevent it being called when page, filters, or orders is updated
  const queryValid = Boolean(memoizedQuery);
  // Set updateDocAtom and deleteDocAtom values if they exist
  useEffect(() => {
    // If path is invalid and no collectionRef was created,
    // don’t set update and delete atoms
    if (!queryValid) return;

    // If `options?.updateDocAtom` was passed,
    // set the atom’s value to a function that updates a doc in the collection
    if (updateDocAtom) {
      setUpdateDocAtom(
        () => (path: string, update: T, deleteFields?: string[]) => {
          const updateToDb = { ...update };

          if (Array.isArray(deleteFields)) {
            for (const field of deleteFields) {
              set(updateToDb as any, field, deleteField());
            }
          }

          return setDoc(doc(firebaseDb, path), updateToDb, { merge: true });
        }
      );
    }

    // If `deleteDocAtom` was passed,
    // set the atom’s value to a function that deletes a doc in the collection
    if (deleteDocAtom) {
      setDeleteDocAtom(
        () => (path: string) => deleteDoc(doc(firebaseDb, path))
      );
    }

    return () => {
      // If `updateDocAtom` was passed,
      // reset the atom’s value to prevent writes
      if (updateDocAtom) setUpdateDocAtom(undefined);
      // If `deleteDoc` was passed,
      // reset the atom’s value to prevent deletes
      if (deleteDocAtom) setDeleteDocAtom(undefined);
    };
  }, [
    firebaseDb,
    queryValid,
    updateDocAtom,
    setUpdateDocAtom,
    deleteDocAtom,
    setDeleteDocAtom,
  ]);
}

export default useFirestoreCollectionWithAtom;

/**
 * Create the Firestore query with page, filters, and orders constraints.
 * Put code in a function so the results can be compared by useMemoValue.
 */
const getQuery = <T>(
  firebaseDb: Firestore,
  path: string | undefined,
  pathSegments: IUseFirestoreCollectionWithAtomOptions<T>["pathSegments"],
  collectionGroup: IUseFirestoreCollectionWithAtomOptions<T>["collectionGroup"],
  page: number,
  pageSize: number,
  filters: IUseFirestoreCollectionWithAtomOptions<T>["filters"],
  orders: IUseFirestoreCollectionWithAtomOptions<T>["orders"]
) => {
  if (!path || (Array.isArray(pathSegments) && pathSegments.some((x) => !x)))
    return null;

  let collectionRef: Query<T>;

  if (collectionGroup) {
    collectionRef = queryCollectionGroup(
      firebaseDb,
      [path, ...((pathSegments as string[]) || [])].join("/")
    ) as Query<T>;
  } else {
    collectionRef = collection(
      firebaseDb,
      path,
      ...((pathSegments as string[]) || [])
    ) as CollectionReference<T>;
  }

  if (!collectionRef) return null;

  const limit = (page + 1) * pageSize;

  return {
    query: query<T>(
      collectionRef,
      queryLimit((page + 1) * pageSize),
      ...(filters?.map((filter) =>
        where(filter.key, filter.operator, filter.value)
      ) || []),
      ...(orders?.map((order) => orderBy(order.key, order.direction)) || [])
    ),
    page,
    limit,
  };
};
