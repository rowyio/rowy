import { useState, useEffect } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, PrimitiveAtom, useSetAtom, SetStateAction } from "jotai";
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
  updateDoc,
  deleteField,
  CollectionReference,
  Query,
  WhereFilterOp,
  documentId,
  getCountFromServer,
  DocumentData,
  or,
  QueryFieldFilterConstraint,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { projectScope } from "@src/atoms/projectScope";
import {
  UpdateCollectionDocFunction,
  DeleteCollectionDocFunction,
  NextPageState,
  TableFilter,
  TableSort,
  TableRow,
} from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";
import { getDateRange, getTimeRange } from "@src/utils/date";

/** Options for {@link useFirestoreCollectionWithAtom} */
interface IUseFirestoreCollectionWithAtomOptions<T> {
  /** Additional path segments appended to the path. If any are undefined, the listener isn’t created at all. */
  pathSegments?: Array<string | undefined>;
  /** Optionally use a collection group query get all documents from collections with the same name as the `path` prop */
  collectionGroup?: boolean;
  /** Attach filters to the query */
  filters?: TableFilter[];
  /** Attach sorts to the query */
  sorts?: TableSort[];
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
  /** Set this atom's value to the number of docs in the collection on each new snapshot */
  serverDocCountAtom?: PrimitiveAtom<number | undefined>;

  joinOperator?: "AND" | "OR";
}

/**
 * Attaches a listener for a Firestore collection and unsubscribes on unmount.
 * Gets the Firestore instance initiated in projectScope.
 * Updates an atom and Suspends that atom until the first snapshot is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Collection path. If falsy, the listener isn’t created at all.
 * @param options - {@link IUseFirestoreCollectionWithAtomOptions}
 */
export function useFirestoreCollectionWithAtom<
  T extends DocumentData = TableRow
>(
  dataAtom: PrimitiveAtom<T[]>,
  dataScope: Parameters<typeof useAtom>[1] | undefined,
  path: string | undefined,
  options?: IUseFirestoreCollectionWithAtomOptions<T>
) {
  // Destructure options so they can be used as useEffect dependencies
  const {
    pathSegments,
    collectionGroup,
    filters,
    sorts,
    page = 0,
    pageSize = COLLECTION_PAGE_SIZE,
    onError,
    disableSuspense,
    updateDocAtom,
    deleteDocAtom,
    nextPageAtom,
    serverDocCountAtom,
    joinOperator,
  } = options || {};

  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
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

  const setServerDocCountAtom = useSetAtom(
    serverDocCountAtom || (dataAtom as any),
    dataScope
  );

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
      joinOperator,
      sorts,
      onError
    ),
    (next, prev) => {
      // If filters are not equal, update the query
      // Firestore queryEqual does not detect when date filters change
      if (
        JSON.stringify(next?.firestoreFilters) !==
        JSON.stringify(prev?.firestoreFilters)
      )
        return false;

      // If joinOperator is not equal, update the query
      if (next?.joinOperator !== prev?.joinOperator) return false;

      // If sorts are not equal, update the query
      // Overrides isLastPage check
      if (JSON.stringify(next?.sorts) !== JSON.stringify(prev?.sorts))
        return false;

      return isLastPage || queryEqual(next?.query as any, prev?.query as any);
    }
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
          // Make sure to unset in case of mistake
          else setIsLastPage(false);
          // Update nextPageAtom if provided
          if (nextPageAtom) {
            setNextPageAtom((s) => ({
              ...s,
              loading: false,
              available: docs.length >= memoizedQuery.limit,
            }));
          }
          // on each new snapshot, use the query to get and set the document count from the server
          if (serverDocCountAtom) {
            getCountFromServer(memoizedQuery.unlimitedQuery).then((value) => {
              setServerDocCountAtom(value.data().count);
            });
          }
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
        if (nextPageAtom) setNextPageAtom({ loading: false, available: false });
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
    serverDocCountAtom,
    setServerDocCountAtom,
  ]);

  // Create variable for validity of query to pass to useEffect dependencies
  // below, and prevent it being called when page, filters, or sorts is updated
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
        () =>
          async (
            path: string,
            update: T,
            deleteFields?: string[],
            options?: {
              useSet?: boolean;
            }
          ) => {
            const updateToDb = { ...update };

            if (Array.isArray(deleteFields)) {
              for (const field of deleteFields) {
                set(updateToDb as any, field, deleteField());
              }
            }

            if (options?.useSet) {
              return await setDoc(doc(firebaseDb, path), updateToDb, {
                merge: true,
              });
            }

            try {
              return await updateDoc(doc(firebaseDb, path), updateToDb);
            } catch (e) {
              return await setDoc(doc(firebaseDb, path), updateToDb, {
                merge: true,
              });
            }
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
 * Create the Firestore query with page, filters, and sorts constraints.
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
  joinOperator: "AND" | "OR" | undefined,
  sorts: IUseFirestoreCollectionWithAtomOptions<T>["sorts"],
  onError: IUseFirestoreCollectionWithAtomOptions<T>["onError"]
) => {
  if (!path || (Array.isArray(pathSegments) && pathSegments.some((x) => !x)))
    return null;

  try {
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
    const firestoreFilters = tableFiltersToFirestoreFilters(filters || []);

    return joinOperator === "OR"
      ? {
          query: query<T>(
            collectionRef,
            or(...firestoreFilters),
            queryLimit(limit),
            ...(sorts?.map((order) => orderBy(order.key, order.direction)) ||
              [])
          ),
          page,
          limit,
          firestoreFilters,
          sorts,
          unlimitedQuery: query<T>(collectionRef, ...firestoreFilters),
          joinOperator,
        }
      : {
          query: query<T>(
            collectionRef,
            queryLimit(limit),
            ...firestoreFilters,
            ...(sorts?.map((order) => orderBy(order.key, order.direction)) ||
              [])
          ),
          page,
          limit,
          firestoreFilters,
          sorts,
          unlimitedQuery: query<T>(collectionRef, ...firestoreFilters),
          joinOperator,
        };
  } catch (e) {
    if (onError) onError(e as FirestoreError);
    return null;
  }
};

/**
 * Support custom filter operators not supported by Firestore.
 * e.g. date-range-equal: `>=` && `<=` operators when `==` is used on dates.
 * @param filters - Array of TableFilters to convert
 * @returns Array of Firestore query `where` constraints
 */
export const tableFiltersToFirestoreFilters = (filters: TableFilter[]) => {
  const firestoreFilters: QueryFieldFilterConstraint[] = [];

  for (const filter of filters) {
    if (filter.operator.startsWith("date-")) {
      if (!filter.value) continue;
      const filterDate =
        "toDate" in filter.value ? filter.value.toDate() : filter.value;
      const [startDate, endDate] = getDateRange(filterDate);

      if (filter.operator === "date-equal") {
        firestoreFilters.push(where(filter.key, ">=", startDate));
        firestoreFilters.push(where(filter.key, "<=", endDate));
      } else if (filter.operator === "date-before") {
        firestoreFilters.push(where(filter.key, "<", startDate));
      } else if (filter.operator === "date-after") {
        firestoreFilters.push(where(filter.key, ">", endDate));
      } else if (filter.operator === "date-before-equal") {
        firestoreFilters.push(where(filter.key, "<=", endDate));
      } else if (filter.operator === "date-after-equal") {
        firestoreFilters.push(where(filter.key, ">=", startDate));
      }
      continue;
    } else if (filter.operator === "time-minute-equal") {
      if (!filter.value) continue;
      const filterDate =
        "toDate" in filter.value ? filter.value.toDate() : filter.value;
      const [startDate, endDate] = getTimeRange(filterDate);

      firestoreFilters.push(where(filter.key, ">=", startDate));
      firestoreFilters.push(where(filter.key, "<=", endDate));
      continue;
    } else if (filter.operator === "id-equal") {
      firestoreFilters.push(where(documentId(), "==", filter.value));
      continue;
    } else if (filter.operator === "color-equal") {
      firestoreFilters.push(
        where(filter.key.concat(".hex"), "==", filter.value.hex.toString())
      );
      continue;
    } else if (filter.operator === "color-not-equal") {
      firestoreFilters.push(
        where(filter.key.concat(".hex"), "!=", filter.value.hex.toString())
      );
      continue;
    } else if (filter.operator === "is-empty") {
      firestoreFilters.push(where(filter.key, "==", ""));
      continue;
    } else if (filter.operator === "is-not-empty") {
      firestoreFilters.push(where(filter.key, "!=", ""));
      continue;
    } else if (filter.operator === "array-contains") {
      if (!filter.value || !filter.value.length) continue;
      // make the value as a singular string
      firestoreFilters.push(
        where(filter.key, filter.operator as WhereFilterOp, filter.value[0])
      );
      continue;
    }

    firestoreFilters.push(
      where(filter.key, filter.operator as WhereFilterOp, filter.value)
    );
  }
  return firestoreFilters;
};
