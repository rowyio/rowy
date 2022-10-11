import { memo, useCallback } from "react";
import { useAtom } from "jotai";
import { FirestoreError } from "firebase/firestore";

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
} from "@src/atoms/tableScope";
import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import useFirestoreCollectionWithAtom from "@src/hooks/useFirestoreCollectionWithAtom";

import useAuditChange from "./useAuditChange";
import useBulkWriteDb from "./useBulkWriteDb";
import { handleFirestoreError } from "./handleFirestoreError";

import { useSnackbar } from "notistack";
import { useErrorHandler } from "react-error-boundary";
import { getTableSchemaPath } from "@src/utils/table";

/**
 * When rendered, provides atom values for top-level tables and sub-tables
 */
export const TableSourceFirestore = memo(function TableSourceFirestore() {
  // Get tableSettings from tableId and tables in projectScope
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  if (!tableSettings) throw new Error("No table config");
  if (!tableSettings.collection)
    throw new Error("Invalid table config: no collection");

  const isCollectionGroup = tableSettings.tableType === "collectionGroup";

  // Get tableSchema and store in tableSchemaAtom.
  // If it doesn’t exist, initialize columns
  useFirestoreDocWithAtom(
    tableSchemaAtom,
    tableScope,
    getTableSchemaPath(tableSettings),
    {
      createIfNonExistent: { columns: {} },
      updateDataAtom: updateTableSchemaAtom,
      disableSuspense: true,
    }
  );

  // Get table filters and sorts
  const [filters] = useAtom(tableFiltersAtom, tableScope);
  const [sorts] = useAtom(tableSortsAtom, tableScope);
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
    tableSettings.collection,
    {
      filters,
      sorts,
      page,
      collectionGroup: isCollectionGroup,
      onError: handleErrorCallback,
      updateDocAtom: _updateRowDbAtom,
      deleteDocAtom: _deleteRowDbAtom,
      nextPageAtom: tableNextPageAtom,
    }
  );

  useAuditChange();
  useBulkWriteDb();

  return null;
});

export default TableSourceFirestore;
