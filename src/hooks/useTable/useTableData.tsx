import { useEffect, useReducer } from "react";
import _findIndex from "lodash/findIndex";
import _isEqual from "lodash/isEqual";
import _set from "lodash/set";
import _uniqBy from "lodash/uniqBy";
import firebase from "firebase/app";
import { db } from "@src/firebase";
import { useSnackbar } from "notistack";

import Button from "@mui/material/Button";

import { useAppContext } from "@src/contexts/AppContext";
import { TableFilter, TableOrder } from ".";
import {
  isCollectionGroup,
  missingFieldsReducer,
  decrementId,
} from "@src/utils/fns";
import { DocumentReference } from "@google-cloud/firestore";

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
      // Get rows that may not be part of the snapshot
      // Rows with missing required fields haven’t been written to the db yet
      // Out of order rows will appear on top
      const localRows = prevRows.filter(
        (r) =>
          (Array.isArray(r._rowy_missingRequiredFields) &&
            r._rowy_missingRequiredFields.length > 0) ||
          r._rowy_outOfOrder === true
      );
      return _uniqBy([...localRows, ...snapshotDocs.map(doc2row)], "ref.path");

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

      // Only write if not missing required fields
      const missingRequiredFields = (
        prevRows[rowIndex]._rowy_missingRequiredFields ?? []
      ).reduce(missingFieldsReducer(_newRows[rowIndex]), []);

      if (missingRequiredFields.length === 0) {
        // Don’t write _rowy_missingRequiredFields to the database
        delete _newRows[rowIndex]._rowy_missingRequiredFields;

        // Omit _rowy_outOfOrder from the update
        const { _rowy_outOfOrder, ...updatedData } = _newRows[rowIndex];

        update.rowRef
          .set(updatedData, { merge: true })
          .then(update.onSuccess, update.onError);
      }

      return _newRows;

    // Add new row to the top
    case "add":
      return _uniqBy([update.newRow, ...prevRows], "id");

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
      // Don’t clear all rows when sorting so out of order rows stay on top
      // tableState.prevFilters !== tableState.filters ||
      // tableState.prevOrderBy !== tableState.orderBy ||
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
        // if (snapshot.docs.length > 0) {
        rowsDispatch({
          type: "onSnapshot",
          docs: snapshot.docs,
          // changes: snapshot.docChanges(),
        });
        // }
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

  const deleteRow = async (
    ref: DocumentReference | DocumentReference[],
    onSuccess: () => void
  ) => {
    // Delete document
    try {
      if (Array.isArray(ref)) {
        await Promise.all(ref.map((r) => r.delete()));
        onSuccess();
        rowsDispatch({ type: "deleteMultiple", rowIds: ref.map((r) => r.id) });
      } else {
        await ref.delete().then(onSuccess);
        // Remove row locally
        return rowsDispatch({ type: "delete", rowId: ref.id });
      }
    } catch (error: any) {
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

  /**
   * Create new document/row
   * @param data Pass an empty object to create an empty row
   * @param requiredFields Passed by ProjectContext addRow method
   * @param onSuccess Callback function to be called after successful creation
   * @param id Pass ID to be created for the row, or omit to use Firestore random ID
   */
  const addRow = async (
    data: any,
    requiredFields: string[],
    onSuccess: (rowId: string) => void,
    id?: string | { type: "smaller" }
  ) => {
    const { path } = tableState;

    let ref = db.collection(path).doc();
    if (typeof id === "string") ref = db.collection(path).doc(id);
    else if (id?.type === "smaller") {
      let prevId =
        rows.find((r) => !r._rowy_outOfOrder)?.id ?? "zzzzzzzzzzzzzzzzzzzz";
      if (
        tableState.orderBy?.length !== 0 ||
        tableState.filters?.length !== 0
      ) {
        const query = await db.collection(tableState.path).limit(1).get();
        prevId = query.empty ? "zzzzzzzzzzzzzzzzzzzz" : query.docs[0].id;
      }
      ref = db.collection(path).doc(decrementId(prevId));
    }

    const newId = ref.id;

    const missingRequiredFields = requiredFields
      ? requiredFields.reduce(missingFieldsReducer(data), [])
      : [];
    console.log(newId, missingRequiredFields.length);

    // If there are missing required fields or intentionally out of order,
    // add to the top of the table view
    if (missingRequiredFields.length > 0 || data._rowy_outOfOrder === true) {
      const newRow = {
        ...data,
        id: newId,
        ref,
        _rowy_missingRequiredFields: missingRequiredFields,
      };
      rowsDispatch({ type: "add", newRow });
    }

    // If there are no missing required fields, attempt to write to the database
    if (missingRequiredFields.length === 0) {
      const { _rowy_outOfOrder, ...dataToWrite } = data;
      try {
        await ref
          .set(dataToWrite, { merge: true })
          .then(() => onSuccess(newId));
      } catch (error: any) {
        if (error.code === "permission-denied") {
          enqueueSnackbar("You do not have the permissions to add new rows.", {
            variant: "error",
          });
        }
      }
    }
  };

  /**
   * Create new rows from an array
   * @param rowsToAdd
   * @param requiredFields Passed by ProjectContext addRow method
   * @param onSuccess Callback function to be called after successful creation
   */
  const addRows = async (
    rowsToAdd: { data: any; id?: string }[],
    requiredFields: string[],
    onSuccess: (rowId: string) => void
  ) => {
    const firstId = decrementId(
      rows.find((r) => !r._rowy_outOfOrder)?.id ?? "zzzzzzzzzzzzzzzzzzzz"
    );
    const ids = [firstId];

    for (const row of rowsToAdd) {
      const { data } = row;

      const nextSmallestId = decrementId(
        ids[ids.length - 1] ??
          rows.find((r) => !r._rowy_outOfOrder)?.id ??
          "zzzzzzzzzzzzzzzzzzzz"
      );

      await addRow(
        data,
        requiredFields,
        (id) => {
          ids.push(id);
          onSuccess(id);
        },
        nextSmallestId
      );
    }
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

  return [{ ...tableState, rows }, tableActions];
};

export default useTableData;
