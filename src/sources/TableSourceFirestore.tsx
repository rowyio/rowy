import { memo, useMemo, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { find, chunk, set } from "lodash-es";
import { doc, writeBatch, deleteField } from "firebase/firestore";

import {
  globalScope,
  tablesAtom,
  rowyRunAtom,
  compatibleRowyRunVersionAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  updateTableSchemaAtom,
  tableFiltersAtom,
  tableOrdersAtom,
  tablePageAtom,
  tableRowsDbAtom,
  _updateRowDbAtom,
  _deleteRowDbAtom,
  _bulkWriteDbAtom,
  tableNextPageAtom,
  auditChangeAtom,
} from "@src/atoms/tableScope";
import { BulkWriteOperation, TableRow } from "@src/types/table";
import { firebaseDbAtom } from "./ProjectSourceFirebase";
import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";
import { TABLE_SCHEMAS, TABLE_GROUP_SCHEMAS } from "@src/config/dbPaths";

import type { FirestoreError } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useErrorHandler } from "react-error-boundary";
import { runRoutes } from "@src/constants/runRoutes";
import { Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

export const ERROR_TABLE_NOT_FOUND = "Table not found";

const TableSourceFirestore = memo(function TableSourceFirestore() {
  const [tables] = useAtom(tablesAtom, globalScope);

  // Get tableSettings from tableId and tables in globalScope
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const setTableSettings = useSetAtom(tableSettingsAtom, tableScope);
  // Store tableSettings as local const so we don’t re-render
  // when tableSettingsAtom is set
  const tableSettings = useMemo(() => {
    const match = find(tables, ["id", tableId]);
    // Store in tableSettingsAtom
    if (match) setTableSettings(match);
    return match;
  }, [tables, tableId, setTableSettings]);
  if (!tableSettings) throw new Error(ERROR_TABLE_NOT_FOUND);

  const isCollectionGroup = tableSettings?.tableType === "collectionGroup";

  // Get tableSchema and store in tableSchemaAtom.
  // If it doesn’t exist, initialize columns
  useFirestoreDocWithAtom(
    tableSchemaAtom,
    tableScope,
    isCollectionGroup ? TABLE_GROUP_SCHEMAS : TABLE_SCHEMAS,
    {
      pathSegments: [tableId],
      createIfNonExistent: { columns: {} },
      updateDataAtom: updateTableSchemaAtom,
    }
  );

  // Get table filters and orders
  const [filters] = useAtom(tableFiltersAtom, tableScope);
  const [orders] = useAtom(tableOrdersAtom, tableScope);
  const [page] = useAtom(tablePageAtom, tableScope);
  // Get documents from collection and store in tableRowsDbAtom
  // and handle some errors with snackbars
  const { enqueueSnackbar } = useSnackbar();
  const elevateError = useErrorHandler();
  const handleErrorCallback = useCallback(
    (error: FirestoreError) =>
      handleFirestoreError(error, enqueueSnackbar, elevateError),
    [enqueueSnackbar, elevateError]
  );
  useFirestoreCollectionWithAtom(
    tableRowsDbAtom,
    tableScope,
    tableSettings?.collection,
    {
      filters,
      orders,
      page,
      collectionGroup: isCollectionGroup,
      onError: handleErrorCallback,
      updateDocAtom: _updateRowDbAtom,
      deleteDocAtom: _deleteRowDbAtom,
      nextPageAtom: tableNextPageAtom,
    }
  );

  // Set auditChange function
  const setAuditChange = useSetAtom(auditChangeAtom, tableScope);
  const [rowyRun] = useAtom(rowyRunAtom, globalScope);
  const [compatibleRowyRunVersion] = useAtom(
    compatibleRowyRunVersionAtom,
    globalScope
  );
  useEffect(() => {
    if (
      !tableSettings?.id ||
      !tableSettings?.collection ||
      !tableSettings.audit ||
      !compatibleRowyRunVersion({ minVersion: "1.1.1" })
    ) {
      setAuditChange(undefined);
      return;
    }

    setAuditChange(
      () =>
        (
          type: "ADD_ROW" | "UPDATE_CELL" | "DELETE_ROW",
          rowId: string,
          data?: { updatedField?: string }
        ) =>
          rowyRun({
            route: runRoutes.auditChange,
            body: {
              type,
              ref: {
                rowPath: tableSettings.collection,
                rowId,
                tableId: tableSettings.id,
                collectionPath: tableSettings.collection,
              },
              data,
            },
          }).catch(console.log)
    );

    return () => setAuditChange(undefined);
  }, [setAuditChange, rowyRun, compatibleRowyRunVersion, tableSettings]);

  // Set _bulkWriteDb function
  const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);
  const setBulkWriteDb = useSetAtom(_bulkWriteDbAtom, tableScope);
  useEffect(() => {
    setBulkWriteDb(
      () => async (operations: BulkWriteOperation<Partial<TableRow>>[]) => {
        // Chunk operations into batches of 500 (Firestore limit is 500)
        const operationsChunked = chunk(operations, 500);
        // Store array of promises so we can run them all at once
        const promises: Promise<void>[] = [];
        // Loop through chunks of 500
        for (const operationsChunk of operationsChunked) {
          // Create Firestore batch transaction
          const batch = writeBatch(firebaseDb);
          // Loop through operations and write to batch
          for (const operation of operationsChunk) {
            // New document
            if (operation.type === "add") {
              batch.set(doc(firebaseDb, operation.path), operation.data);
            }
            // Update existing document and merge values and delete fields
            else if (operation.type === "update") {
              const updateToDb = { ...operation.data };
              if (Array.isArray(operation.deleteFields)) {
                for (const field of operation.deleteFields) {
                  set(updateToDb as any, field, deleteField());
                }
              }
              batch.set(doc(firebaseDb, operation.path), operation.data, {
                merge: true,
              });
            }
            // Delete existing documents
            else if (operation.type === "delete") {
              batch.delete(doc(firebaseDb, operation.path));
            }
          }
          // Add to promises array
          // promises.push(
          await batch.commit().then(() => console.log("Batch committed"));
          // );
        }
        // Return promise that waits for all promises to resolve
        return Promise.all(promises);
      }
    );

    return () => setBulkWriteDb(undefined);
  }, [firebaseDb, setBulkWriteDb]);

  return null;
});

const handleFirestoreError = (
  error: FirestoreError,
  enqueueSnackbar: ReturnType<typeof useSnackbar>["enqueueSnackbar"],
  elevateError: (error: FirestoreError) => void
) => {
  if (error.code === "permission-denied") {
    enqueueSnackbar("You do not have access to this table", {
      variant: "error",
    });
    return;
  }

  if (error.message.includes("indexes?create_composite=")) {
    enqueueSnackbar(
      "Filtering while having another column sorted requires a new Firestore index",
      {
        variant: "warning",
        action: (
          <Button
            variant="contained"
            color="secondary"
            href={"https" + error.message.split("https").pop()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Create index
            <InlineOpenInNewIcon style={{ lineHeight: "16px" }} />
          </Button>
        ),
      }
    );
    return;
  }

  elevateError(error);
};

export default TableSourceFirestore;
