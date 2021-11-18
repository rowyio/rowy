import { useEffect, useReducer } from "react";
import _findIndex from "lodash/findIndex";
import _orderBy from "lodash/orderBy";
import _isEqual from "lodash/isEqual";
import _set from "lodash/set";
import firebase from "firebase/app";
import { db } from "@src/firebase";
import { useSnackbar } from "notistack";

import Button from "@mui/material/Button";

import { useAppContext } from "@src/contexts/AppContext";
import { TableFilter, TableOrder } from ".";
import {
  isCollectionGroup,
  decrementId,
  missingFieldsReducer,
} from "@src/utils/fns";

// Safety parameter sets the upper limit of number of docs fetched by this hook
export const CAP = 1000;

const tableReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};

const doc2row = (doc) => {
  const data = doc.data();
  const id = doc.id;
  const ref = doc.ref;
  return { ...data, id, ref };
};

const rowsReducer = (prevRows: any, update: any) => {
  switch (update.type) {
    case "onSnapshot":
      const snapshotDocs = update.docs;
      const localRows = prevRows.filter(
        (r) => !snapshotDocs.some((d) => d.id === r.id)
      );
      return [...localRows, ...snapshotDocs.map(doc2row)];

    case "delete":
      return prevRows.filter((row) => update.rowId !== row.id);
    case "deleteMultiple":
      return prevRows.filter((row) => !update.rowIds.includes(row.id));
    case "set":
      return update.rows;

    case "update":
      const rowIndex = _findIndex(
        prevRows,
        (r: any) => r.id === update.rowRef.id
      );
      const _newRows = [...prevRows];
      // Must not use lodash merge here. Breaks Connect Table: cannot clear value
      for (const [key, value] of Object.entries(update.update)) {
        _set(_newRows[rowIndex], key, value);
      }

      const missingRequiredFields = (
        prevRows[rowIndex]._missingRequiredFields ?? []
      ).reduce(missingFieldsReducer(_newRows[rowIndex]), []);
      if (missingRequiredFields.length === 0) {
        delete _newRows[rowIndex]._missingRequiredFields;
        update.rowRef
          .set(_newRows[rowIndex], { merge: true })
          .then(update.onSuccess, update.onError);
      }

      return _newRows;

    case "add":
      return [update.newRow, ...prevRows];

    case "queryChange":
      return [];
  }
};
const tableInitialState = {
  prevFilters: null,
  prevPath: null,
  orderBy: [],
  prevOrderBy: null,
  path: null,
  filters: [],
  prevLimit: 0,
  limit: 50,
  loading: true,
  cap: CAP,
};

const useTableData = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { projectId } = useAppContext();

  const [tableState, tableDispatch] = useReducer(
    tableReducer,
    tableInitialState
  );
  const [rows, rowsDispatch] = useReducer(rowsReducer, []);
  console.log(rows);
  /**  set collection listener
   *  @param filters
   *  @param limit max number of docs
   *  @param orderBy
   */
  const getRows = (
    filters: {
      key: string;
      operator: "==" | "<" | ">" | ">=" | "<=";
      value: string;
    }[],
    limit: number,
    orderBy: TableOrder
  ) => {
    //unsubscribe from old path
    if (tableState.prevPath && tableState.path !== tableState.prevPath) {
      tableState.unsubscribe();
    }
    //updates previous values
    if (
      tableState.prevFilters !== tableState.filters ||
      tableState.prevOrderBy !== tableState.orderBy ||
      tableState.prevPath !== tableState.path
    ) {
      rowsDispatch({ type: "queryChange" });
    }
    tableDispatch({
      prevFilters: filters,
      prevLimit: limit,
      prevPath: tableState.path,
      prevOrderBy: tableState.orderBy,
      loading: true,
    });
    let query:
      | firebase.firestore.CollectionReference
      | firebase.firestore.Query = isCollectionGroup()
      ? db.collectionGroup(tableState.path)
      : db.collection(tableState.path.replace(/~2F/g, "/"));

    filters.forEach((filter) => {
      if (filter.key && filter.operator && filter.value !== undefined)
        query = query.where(filter.key, filter.operator, filter.value);
    });

    orderBy?.forEach((order) => {
      query = query.orderBy(order.key, order.direction);
    });

    const unsubscribe = query.limit(limit).onSnapshot(
      (snapshot) => {
        if (snapshot.docs.length > 0) {
          rowsDispatch({ type: "onSnapshot", docs: snapshot.docs });
        }
        tableDispatch({ loading: false });
      },
      (error: any) => {
        //TODO:callable to create new index
        if (error?.message.includes("indexes?create_composite=")) {
          const url =
            `https://console.firebase.google.com/project/${projectId}/database/firestore/` +
            "indexes?create_composite=" +
            error.message.split("indexes?create_composite=")[1];

          enqueueSnackbar(
            "Filtering while sorting by a column requires a new Firestore index",
            {
              variant: "warning",
              action: (
                <Button
                  variant="contained"
                  color="secondary"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create index
                </Button>
              ),
            }
          );
        } else if (error.code === "permission-denied") {
          enqueueSnackbar(
            "You do not have the permissions to see the results.",
            {
              variant: "error",
            }
          );
        }
      }
    );
    tableDispatch({ unsubscribe });
  };
  useEffect(() => {
    const {
      prevFilters,
      filters,
      prevLimit,
      prevOrderBy,
      limit,
      prevPath,
      path,
      orderBy,
      unsubscribe,
    } = tableState;

    if (
      (prevPath !== path ||
        !_isEqual(prevFilters, filters) ||
        prevLimit !== limit ||
        prevOrderBy !== orderBy) &&
      path
    ) {
      if (unsubscribe) {
        tableState.unsubscribe();
      }
      getRows(filters, limit, orderBy);
    }
    return () => {
      if (unsubscribe) {
        tableState.unsubscribe();
      }
    };
  }, [
    tableState.filters,
    tableState.limit,
    tableState.path,
    tableState.orderBy,
  ]);
  /**  used deleting row/doc
   *  @param rowIndex local position
   *  @param documentId firestore document id
   */

  const deleteRow = async (rowId: string | string[], onSuccess: () => void) => {
    // Delete document
    try {
      if (Array.isArray(rowId)) {
        await Promise.all(
          rowId.map((id) => db.collection(tableState.path).doc(id).delete())
        );
        onSuccess();
        rowsDispatch({ type: "deleteMultiple", rowIds: rowId });
      } else {
        await db
          .collection(tableState.path)
          .doc(rowId)
          .delete()
          .then(onSuccess);
        // Remove row locally
        return rowsDispatch({ type: "delete", rowId });
      }
    } catch (error: any) {
      console.log(error);
      if (error.code === "permission-denied") {
        enqueueSnackbar("You do not have the permissions to delete this row.", {
          variant: "error",
        });
      }
      return false;
    }
  };
  /**  used for setting up the table listener
   *  @param tableCollection firestore collection path
   *  @param filters specify filters to be applied to the query
   */
  const setTable = (tableCollection: string, filters?: TableFilter) => {
    if (tableCollection !== tableState.path) {
      tableDispatch({
        path: tableCollection,
        rows: [],
        orderBy: [],
      });
    }
    if (filters) tableDispatch({ filters });
  };

  /**  creating new document/row
   *  @param data(optional: default will create empty row)
   */
  const addRow = async (
    data: any,
    requiredFields: string[],
    onSuccess: (rowId: string) => void,
    id?: string
  ) => {
    const missingRequiredFields = requiredFields
      ? requiredFields.reduce(missingFieldsReducer(data), [])
      : [];

    const { path } = tableState;
    const newId =
      id ??
      decrementId(
        rows[0]?.id ?? "zzzzzzzzzzzzzzzzzzzzzzzz",
        Math.round(Math.random() * 100)
      );
    if (missingRequiredFields.length === 0) {
      try {
        await db
          .collection(path)
          .doc(newId)
          .set(data, { merge: true })
          .then(() => {
            onSuccess(newId);
          });
      } catch (error: any) {
        if (error.code === "permission-denied") {
          enqueueSnackbar("You do not have the permissions to add new rows.", {
            variant: "error",
          });
        }
      }
    } else {
      // missing required fields
      const id = newId;
      const ref = db.collection(path).doc(newId);
      const newRow = {
        ...data,
        id,
        ref,
        _missingRequiredFields: missingRequiredFields,
      };
      rowsDispatch({ type: "add", newRow });
    }
  };

  /**  creating new rows from array
   *  @param rows
   * @param onSuccess
   * @param requiredFields
   */
  const addRows = async (
    rows: { data: any; id?: string }[],
    requiredFields: string[],
    onSuccess: (rowIds: string) => void
  ) => {
    let previousId = rows[0]?.id ?? "zzzzzzzzzzzzzzzzzzzzzzzz";
    rows.forEach(async (row) => {
      const { data, id } = row;
      const missingRequiredFields = requiredFields
        ? requiredFields.reduce(missingFieldsReducer(data), [])
        : [];
      const newId =
        id ?? decrementId(previousId, Math.round(Math.random() * 100));
      previousId = newId;
      if (missingRequiredFields.length === 0) {
        try {
          await db
            .collection(tableState.path)
            .doc(newId)
            .set(data, { merge: true })
            .then(() => {
              onSuccess(newId);
            });
        } catch (error: any) {
          if (error.code === "permission-denied") {
            enqueueSnackbar(
              "You do not have the permissions to add new rows.",
              {
                variant: "error",
              }
            );
          }
        }
      } else {
        const ref = db.collection(tableState.path).doc(newId);
        const newRow = {
          ...data,
          id: newId,
          ref,
          _missingRequiredFields: missingRequiredFields,
        };
        rowsDispatch({ type: "add", newRow });
      }
    });
  };

  const updateRow = (rowRef, update, onSuccess, onError) => {
    rowsDispatch({ type: "update", update, rowRef, onSuccess, onError });
  };

  /**  used for incrementing the number of rows fetched
   *  @param additionalRows number additional rows to be fetched (optional: default is 150)
   */
  const moreRows = (additionalRows?: number) => {
    // Don’t request more when already loading
    if (tableState.loading) return;

    // Don’t request more if none remaining.
    if (rows.length < tableState.limit) return;

    tableDispatch({
      limit: tableState.limit + (additionalRows ? additionalRows : 100),
    });
  };

  const tableActions = {
    deleteRow,
    setTable,
    addRow,
    addRows,
    updateRow,
    moreRows,
    dispatch: tableDispatch,
  };
  const orderedRows = tableState.orderBy?.[0]
    ? _orderBy(
        rows,
        [tableState.orderBy[0].key],
        [tableState.orderBy[0].direction]
      )
    : _orderBy(rows, ["id"], ["asc"]);
  return [{ ...tableState, rows: orderedRows }, tableActions];
};

export default useTableData;
