import { memo, useCallback, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import useMemoValue from "use-memo-value";
import { cloneDeep, set } from "lodash-es";
import {
  FirestoreError,
  deleteField,
  refEqual,
  setDoc,
} from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useErrorHandler } from "react-error-boundary";

import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
  tableFiltersAtom,
  tableSortsAtom,
  tablePageAtom,
  tableRowsDbAtom,
  _updateRowDbAtom,
  _deleteRowDbAtom,
  tableNextPageAtom,
  serverDocCountAtom,
  tableFiltersJoinAtom,
} from "@src/atoms/tableScope";

import useFirestoreDocWithAtom, {
  getDocRef,
} from "@src/hooks/useFirestoreDocWithAtom";
import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";

import useAuditChange from "./useAuditChange";
import useBulkWriteDb from "./useBulkWriteDb";
import { handleFirestoreError } from "./handleFirestoreError";

import { getTableSchemaPath } from "@src/utils/table";
import { TableSchema } from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { projectScope } from "@src/atoms/projectScope";

/**
 * When rendered, provides atom values for top-level tables and sub-tables
 */
export const TableSourceFirestore = memo(function TableSourceFirestore() {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const setTableSchema = useSetAtom(tableSchemaAtom, tableScope);
  const setUpdateTableSchema = useSetAtom(updateTableSchemaAtom, tableScope);

  const { enqueueSnackbar } = useSnackbar();

  if (!tableSettings) throw new Error("No table config");
  if (!tableSettings.collection)
    throw new Error("Invalid table config: no collection");

  const tableSchemaDocRef = useMemoValue(
    getDocRef<TableSchema>(firebaseDb, getTableSchemaPath(tableSettings)),
    (next, prev) => refEqual(next as any, prev as any)
  );
  const isCollectionGroup = tableSettings.tableType === "collectionGroup";

  useEffect(() => {
    if (!tableSchemaDocRef) return;

    setUpdateTableSchema(
      () => (update: TableSchema, deleteFields?: string[]) => {
        const updateToDb = cloneDeep(update);

        if (Array.isArray(deleteFields)) {
          for (const field of deleteFields) {
            // Use deterministic set firestore sentinel's on schema columns config
            // Required for nested columns
            // i.e field = "columns.base.nested.nested"
            // key: columns, rest: base.nested.nested
            // set columns["base.nested.nested"] instead columns.base.nested.nested
            const [key, ...rest] = field.split(".");
            if (key === "columns") {
              (updateToDb as any).columns[rest.join(".")] = deleteField();
            } else {
              set(updateToDb, field, deleteField());
            }
          }
        }

        // Update UI state to reflect changes immediately to prevent flickering effects
        setTableSchema((tableSchema) => ({ ...tableSchema, ...update }));

        return setDoc(tableSchemaDocRef, updateToDb, { merge: true }).catch(
          (e) => {
            enqueueSnackbar((e as Error).message, { variant: "error" });
          }
        );
      }
    );

    return () => {
      setUpdateTableSchema(undefined);
    };
  }, [tableSchemaDocRef, setTableSchema, setUpdateTableSchema, enqueueSnackbar]);

  // Get tableSchema and store in tableSchemaAtom.
  // If it doesn’t exist, initialize columns
  useFirestoreDocWithAtom(
    tableSchemaAtom,
    tableScope,
    getTableSchemaPath(tableSettings),
    {
      createIfNonExistent: { columns: {} },
      disableSuspense: true,
    }
  );

  const [joinOperator] = useAtom(tableFiltersJoinAtom, tableScope);

  // Get table filters and sorts
  const [filters] = useAtom(tableFiltersAtom, tableScope);
  const [sorts] = useAtom(tableSortsAtom, tableScope);
  const [page] = useAtom(tablePageAtom, tableScope);
  // Get documents from collection and store in tableRowsDbAtom
  // and handle some errors with snackbars
  const elevateError = useErrorHandler();
  const handleErrorCallback = useCallback(
    (error: FirestoreError) =>
      handleFirestoreError(error, enqueueSnackbar, elevateError),
    [enqueueSnackbar, elevateError]
  );
  useFirestoreCollectionWithAtom(
    tableRowsDbAtom,
    tableScope,
    tableSettings.collection,
    {
      filters,
      joinOperator,
      sorts,
      page,
      collectionGroup: isCollectionGroup,
      onError: handleErrorCallback,
      updateDocAtom: _updateRowDbAtom,
      deleteDocAtom: _deleteRowDbAtom,
      nextPageAtom: tableNextPageAtom,
      serverDocCountAtom: serverDocCountAtom,
    }
  );

  useAuditChange();
  useBulkWriteDb();

  return null;
});

export default TableSourceFirestore;
