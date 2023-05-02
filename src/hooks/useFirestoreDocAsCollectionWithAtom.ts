import { useCallback, useEffect } from "react";
import useMemoValue from "use-memo-value";
import { useAtom, PrimitiveAtom, useSetAtom } from "jotai";
import { orderBy } from "lodash-es";
import { useSnackbar } from "notistack";

import {
  Firestore,
  doc,
  refEqual,
  onSnapshot,
  FirestoreError,
  DocumentReference,
  runTransaction,
} from "firebase/firestore";
import { useErrorHandler } from "react-error-boundary";

import { projectScope } from "@src/atoms/projectScope";
import {
  ArrayTableRowData,
  DeleteCollectionDocFunction,
  TableRow,
  TableSort,
  UpdateCollectionDocFunction,
} from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { omitRowyFields } from "@src/utils/table";

type UpdateFunction<T> = (rows: T[]) => T[];

/** Options for {@link useFirestoreDocWithAtom} */
interface IUseFirestoreDocWithAtomOptions<T> {
  /** Called when an error occurs. Make sure to wrap in useCallback! If not provided, errors trigger the nearest ErrorBoundary. */
  onError?: (error: FirestoreError) => void;
  /** Optionally disable Suspense */
  disableSuspense?: boolean;
  /** Optionally create the document if it doesn’t exist with the following data */
  createIfNonExistent?: T;
  /** Set this atom’s value to a function that updates the document. Uses same scope as `dataScope`. */
  // updateDataAtom?: PrimitiveAtom<UpdateDocFunction<T> | undefined>;
  updateDocAtom?: PrimitiveAtom<UpdateCollectionDocFunction<T> | undefined>;
  deleteDocAtom?: PrimitiveAtom<DeleteCollectionDocFunction | undefined>;
  sorts?: TableSort[];
}

/**
 * Attaches a listener for a Firestore document and unsubscribes on unmount.
 * Gets the Firestore instance initiated in projectScope.
 * Updates an atom and Suspends that atom until the first snapshot is received.
 *
 * @param dataAtom - Atom to store data in
 * @param dataScope - Atom scope
 * @param path - Document path. If falsy, the listener isn’t created at all.
 * @param fieldName - Parent field name
 * @param options - {@link IUseFirestoreDocWithAtomOptions}
 */
export function useFirestoreDocAsCollectionWithAtom<T = TableRow>(
  dataAtom: PrimitiveAtom<T[]>,
  dataScope: Parameters<typeof useAtom>[1] | undefined,
  path: string,
  fieldName: string,
  options: IUseFirestoreDocWithAtomOptions<T>
) {
  // Destructure options so they can be used as useEffect dependencies
  const {
    onError,
    disableSuspense,
    createIfNonExistent,
    updateDocAtom,
    deleteDocAtom,
    sorts,
  } = options || {};

  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const setDataAtom = useSetAtom(dataAtom, dataScope);
  const { addRow, deleteRow, deleteField, updateTable } = useAlterArrayTable<T>(
    {
      firebaseDb,
      dataAtom,
      dataScope,
      sorts,
      path,
      fieldName,
    }
  );
  const handleError = useErrorHandler();
  const { enqueueSnackbar } = useSnackbar();
  const setUpdateDocAtom = useSetAtom(
    updateDocAtom || (dataAtom as any),
    dataScope
  );
  const setDeleteRowAtom = useSetAtom(
    deleteDocAtom || (dataAtom as any),
    dataScope
  );

  // Create the doc ref and memoize using Firestore’s refEqual
  const memoizedDocRef = useMemoValue(
    getDocRef<T>(firebaseDb, path),
    (next, prev) => refEqual(next as any, prev as any)
  );

  useEffect(() => {
    // If path is invalid and no memoizedDocRef was created, don’t continue
    if (!memoizedDocRef) return;

    // Suspend data atom until we get the first snapshot
    let suspended = false;
    if (!disableSuspense) {
      setDataAtom(new Promise(() => []) as unknown as T[]);
      suspended = true;
    }

    // Create a listener for the document
    const unsubscribe = onSnapshot(
      memoizedDocRef,
      { includeMetadataChanges: true },
      (docSnapshot) => {
        try {
          if (docSnapshot.exists() && docSnapshot.data() !== undefined) {
            const pseudoDoc = docSnapshot.get(fieldName) || [];
            const pseudoRow = pseudoDoc.map((row: any, i: number) => {
              return {
                ...row,
                _rowy_ref: {
                  path: docSnapshot.ref.path,
                  id: docSnapshot.ref.id,
                  arrayTableData: {
                    index: i,
                    parentField: fieldName,
                  },
                },
              };
            });
            const sorted = sortRows<T>(pseudoRow, sorts);
            setDataAtom(sorted);
          } else {
            enqueueSnackbar(`Array table doesn't exist`, {
              variant: "error",
            });
            // console.log("docSnapshot", docSnapshot.data());
            // setDataAtom([] as T[]);
          }
        } catch (error) {
          if (onError) onError(error as FirestoreError);
          else handleError(error);
        }
        suspended = false;
      },
      (error) => {
        if (suspended) setDataAtom([] as T[]);
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
    fieldName,
    sorts,
    enqueueSnackbar,
  ]);

  const setRows = useCallback(
    (updateFunction: UpdateFunction<T>) => {
      if (!fieldName) return;

      try {
        return runTransaction(firebaseDb, async (transaction) => {
          const docRef = doc(firebaseDb, path);
          const docSnap = await transaction.get(docRef);
          const rows = docSnap.data()?.[fieldName] || [];

          const updatedRows = updateFunction(rows);

          return await transaction.set(
            docRef,
            { [fieldName]: updatedRows },
            { merge: true }
          );
        });
      } catch (error) {
        enqueueSnackbar(`Error updating array table`, {
          variant: "error",
        });
        return;
      }
    },
    [enqueueSnackbar, fieldName, firebaseDb, path]
  );

  useEffect(() => {
    if (deleteDocAtom) {
      setDeleteRowAtom(() => (_: string, options?: ArrayTableRowData) => {
        if (!options || options.index === undefined) return;
        const updateFunction = deleteRow(options.index);
        return setRows(updateFunction);
      });
    }
  }, [
    deleteDocAtom,
    deleteRow,
    fieldName,
    firebaseDb,
    path,
    setDataAtom,
    setDeleteRowAtom,
    setRows,
    sorts,
  ]);

  useEffect(() => {
    if (updateDocAtom) {
      setUpdateDocAtom(
        () =>
          (
            _: string,
            update: T,
            deleteFields?: string[],
            options?: ArrayTableRowData
          ) => {
            if (options === undefined) return;

            const deleteRowFields = () => {
              if (options.index === undefined) return;

              const updateFunction = deleteField(options.index, deleteFields);
              return setRows(updateFunction);
            };

            const updateRowValues = () => {
              if (options.index === undefined) return;

              const updateFunction = updateTable(options.index, update);
              return setRows(updateFunction);
            };

            const addNewRow = (addTo: "top" | "bottom", base?: T) => {
              const updateFunction = addRow(addTo, base ?? update);
              return setRows(updateFunction);
            };

            if (Array.isArray(deleteFields) && deleteFields.length > 0) {
              return deleteRowFields();
            } else if (options.operation?.addRow) {
              return addNewRow(
                options.operation.addRow,
                options?.operation.base as T
              );
            } else {
              return updateRowValues();
            }
          }
      );
    }
  }, [
    addRow,
    deleteField,
    fieldName,
    firebaseDb,
    path,
    setDataAtom,
    setRows,
    setUpdateDocAtom,
    sorts,
    updateDocAtom,
    updateTable,
  ]);
}

export default useFirestoreDocAsCollectionWithAtom;

function useAlterArrayTable<T>({
  firebaseDb,
  dataAtom,
  dataScope,
  sorts,
  path,
  fieldName,
}: {
  firebaseDb: Firestore;
  dataAtom: PrimitiveAtom<T[]>;
  dataScope: Parameters<typeof useAtom>[1] | undefined;
  sorts: TableSort[] | undefined;
  path: string;
  fieldName: string;
}) {
  const setData = useSetAtom(dataAtom, dataScope);

  const add = useCallback(
    (addTo: "top" | "bottom", base?: T): UpdateFunction<T> => {
      if (base) {
        base = omitRowyFields(base);
      }
      const newRow = (i: number, meta: boolean) => {
        const _meta = {
          _rowy_ref: {
            id: doc(firebaseDb, path).id,
            path: doc(firebaseDb, path).path,
            arrayTableData: {
              index: i,
              parentField: fieldName,
            },
          },
        };
        if (meta === true) {
          return {
            ...(base ?? {}),
            ..._meta,
          } as T;
        }
        return {
          ...(base ?? {}),
        } as T;
      };

      setData((prevData) => {
        prevData = unsortRows(prevData);

        if (addTo === "bottom") {
          prevData.push(newRow(prevData.length, true));
        } else {
          const modifiedPrevData = prevData.map((row: any, i: number) => {
            return {
              ...row,
              _rowy_ref: {
                ...row._rowy_ref,
                arrayTableData: {
                  index: i + 1,
                  parentField: fieldName,
                },
              },
            };
          });
          prevData = [newRow(0, true), ...modifiedPrevData];
        }
        return sortRows(prevData, sorts);
      });

      return (rows) => {
        if (addTo === "bottom") {
          rows.push(newRow(rows.length, false));
        } else {
          rows = [newRow(0, false), ...rows];
        }
        return rows;
      };
    },
    [fieldName, firebaseDb, path, setData, sorts]
  );

  const _delete = useCallback(
    (index: number): UpdateFunction<T> => {
      setData((prevData) => {
        prevData = unsortRows<T>(prevData);
        prevData.splice(index, 1);
        for (let i = index; i < prevData.length; i++) {
          // @ts-ignore
          prevData[i]._rowy_ref.arrayTableData.index = i;
        }
        return sortRows(prevData, sorts);
      });
      return (rows) => {
        rows.splice(index, 1);
        return [...rows];
      };
    },
    [setData, sorts]
  );

  const deleteField = useCallback(
    (index: number, deleteFields?: string[]): UpdateFunction<T> => {
      setData((prevData) => {
        prevData = unsortRows(prevData);

        if (deleteFields === undefined) return prevData;

        prevData[index] = {
          ...prevData[index],
          ...deleteFields?.reduce(
            (acc, field) => ({ ...acc, [field]: undefined }),
            {}
          ),
        };

        return sortRows(prevData, sorts);
      });
      return (rows) => {
        if (deleteFields === undefined) return rows;

        rows[index] = {
          ...rows[index],
          ...deleteFields?.reduce(
            (acc, field) => ({ ...acc, [field]: undefined }),
            {}
          ),
        };

        return rows;
      };
    },
    [setData, sorts]
  );

  const update = useCallback(
    (index: number, update: Partial<T>): UpdateFunction<T> => {
      setData((prevData) => {
        prevData = unsortRows(prevData);
        prevData[index] = {
          ...prevData[index],
          ...update,
        };

        return sortRows(prevData, sorts);
      });

      return (rows) => {
        rows[index] = {
          ...rows[index],
          ...update,
        };
        return rows;
      };
    },
    [setData, sorts]
  );

  return {
    addRow: add,
    deleteRow: _delete,
    deleteField: deleteField,
    updateTable: update,
  };
}

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

function sortRows<T = TableRow>(
  rows: T[],
  sorts: TableSort[] | undefined
): T[] {
  if (sorts === undefined || sorts.length < 1) {
    return rows;
  }

  const order: "asc" | "desc" =
    sorts[0].direction === undefined ? "asc" : sorts[0].direction;

  return orderBy(rows, [sorts[0].key], [order]);
}

function unsortRows<T = TableRow>(rows: T[]): T[] {
  return orderBy(rows, ["_rowy_ref.arrayTableData.index"], ["asc"]);
}
