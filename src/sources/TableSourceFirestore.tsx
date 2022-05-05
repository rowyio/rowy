import { memo, useMemo, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { find } from "lodash-es";

import { globalScope, tablesAtom } from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  tableFiltersAtom,
  tableOrdersAtom,
  tablePageAtom,
  tableRowsDbAtom,
} from "@src/atoms/tableScope";

import useFirestoreDocWithAtom from "@src/hooks/useFirestoreDocWithAtom";
import useFirestoreCollectionWithAtom, {
  DEFAULT_COLLECTION_QUERY_LIMIT,
} from "@src/hooks/useFirestoreCollectionWithAtom";
import { TABLE_SCHEMAS, TABLE_GROUP_SCHEMAS } from "@src/config/dbPaths";

import type { FirestoreError } from "firebase/firestore";
import { useSnackbar } from "notistack";
import { useErrorHandler } from "react-error-boundary";
import { Button } from "@mui/material";
import InlineOpenInNewIcon from "@src/components/InlineOpenInNewIcon";

export const ERROR_TABLE_NOT_FOUND = "Table not found";

const TableSourceFirestore = memo(function TableSourceFirestore() {
  const [tables] = useAtom(tablesAtom, globalScope);
  // const [firebaseDb] = useAtom(firebaseDbAtom, globalScope);

  // Get tableSettings from tableId and tables in globalScope
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const setTableSettings = useSetAtom(tableSettingsAtom, tableScope);
  // Store tableSettings as local const so we don’t re-render
  // when tableSettingsAtom is set
  const tableSettings = useMemo(
    () => find(tables, ["id", tableId]),
    [tables, tableId]
  );
  if (!tableSettings) throw new Error(ERROR_TABLE_NOT_FOUND);
  // Store in tableSettingsAtom
  useEffect(() => {
    setTableSettings(tableSettings);
  }, [tableSettings, setTableSettings]);

  const isCollectionGroup = tableSettings?.tableType === "collectionGroup";

  // Get tableSchema and store in tableSchemaAtom.
  // If it doesn’t exist, initialize columns
  useFirestoreDocWithAtom(
    tableSchemaAtom,
    tableScope,
    isCollectionGroup ? TABLE_GROUP_SCHEMAS : TABLE_SCHEMAS,
    { pathSegments: [tableId], createIfNonExistent: { columns: {} } }
  );

  // Get table filters and orders
  const [filters] = useAtom(tableFiltersAtom, tableScope);
  const [orders] = useAtom(tableOrdersAtom, tableScope);
  const [page] = useAtom(tablePageAtom, tableScope);
  // Get documents from collection and store in tableRowsDbAtom
  // and handle some errors with snackbars
  const { enqueueSnackbar } = useSnackbar();
  const elevateError = useErrorHandler();
  useFirestoreCollectionWithAtom(
    tableRowsDbAtom,
    tableScope,
    tableSettings?.collection,
    {
      filters,
      orders,
      limit: DEFAULT_COLLECTION_QUERY_LIMIT * (page + 1),
      collectionGroup: isCollectionGroup,
      onError: (error) =>
        handleFirestoreError(error, enqueueSnackbar, elevateError),
    }
  );

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
