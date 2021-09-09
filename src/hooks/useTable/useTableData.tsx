import { db } from "../../firebase";
import { useSnackbar } from "notistack";

import Button from "@material-ui/core/Button";
import { useEffect, useReducer, useContext } from "react";
import _isEqual from "lodash/isEqual";
import _merge from "lodash/merge";
import _find from "lodash/find";
import firebase from "firebase/app";
import { TableFilter, TableOrder } from ".";

import {
  isCollectionGroup,
  generateSmallerId,
  missingFieldsReducer,
  deepMerge,
  deepen,
} from "utils/fns";
import { projectId } from "../../firebase";
import _findIndex from "lodash/findIndex";
import _orderBy from "lodash/orderBy";
import { rowyUser } from "contexts/ProjectContext";
import { useAppContext } from "contexts/AppContext";
const CAP = 1000; // safety  paramter sets the  upper limit of number of docs fetched by this hook
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

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
      const localRowsIds = prevRows.map((r) => r.id); // used to remove added docs that were added from this client
      const addedRows = update.changes
        .filter((change) => change.type === "added")
        .map((change) => doc2row(change.doc))
        .filter((row) => !localRowsIds.includes(row.id));
      const removedRowIds = update.changes
        .filter((change) => change.type === "removed")
        .map((change) => change.doc.id);
      const _rows = [
        ...addedRows,
        ...prevRows.filter((row) => !removedRowIds.includes(row.id)),
      ];
      const modifiedRows = update.changes
        .filter((change) => change.type === "modified")
        .map((change) => doc2row(change.doc));
      modifiedRows.forEach((row) => {
        const rowIndex = _findIndex(_rows, (r) => r.id === row.id);
        _rows[rowIndex] = row;
      });
      return _rows;
    case "delete":
      return prevRows.filter((row) => update.rowId !== row.id);
    case "set":
      return update.rows;

    case "update":
      const rowIndex = _findIndex(
        prevRows,
        (r: any) => r.id === update.rowRef.id
      );
      const _newRows = [...prevRows];
      _newRows[rowIndex] = _merge(_newRows[rowIndex], deepen(update.update));

      const missingRequiredFields = (
        prevRows[rowIndex]._missingRequiredFields ?? []
      ).reduce(missingFieldsReducer(_newRows[rowIndex]), []);

      if (missingRequiredFields.length === 0) {
        update.rowRef
          .set(_newRows[rowIndex], { merge: true })
          .then(update.onSuccess, update.onError);
        delete _newRows[rowIndex]._missingRequiredFields;
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

const useTableData = (initialOverrides: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { currentUser } = useAppContext();

  const [tableState, tableDispatch] = useReducer(tableReducer, {
    ...tableInitialState,
    ...initialOverrides,
  });
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
          const changes = snapshot.docChanges();
          rowsDispatch({ type: "onSnapshot", changes });
        }
        tableDispatch({
          loading: false,
        });
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
                  Create Index
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
  const deleteRow = (rowId: string) => {
    //remove row locally
    rowsDispatch({ type: "delete", rowId });
    // delete document
    try {
      db.collection(tableState.path).doc(rowId).delete();
    } catch (error: any) {
      console.log(error);
      if (error.code === "permission-denied") {
        enqueueSnackbar("You do not have the permissions to delete rows.", {
          variant: "error",
        });
      }
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

  const filterReducer = (acc, curr) => {
    if (curr.operator === "==") {
      return { ...acc, [curr.key]: curr.value };
    } else return acc;
  };
  /**  creating new document/row
   *  @param data(optional: default will create empty row)
   */
  const addRow = async (data: any, requiredFields: string[]) => {
    const missingRequiredFields = requiredFields
      ? requiredFields.reduce(missingFieldsReducer(data), [])
      : [];
    const valuesFromFilter = tableState.filters.reduce(filterReducer, {});
    const { path } = tableState;
    const newId = generateSmallerId(rows[0]?.id ?? "zzzzzzzzzzzzzzzzzzzzzzzz");
    const docData = {
      ...valuesFromFilter,
      _createdAt: serverTimestamp(),
      _createdBy: rowyUser(currentUser),
      _updatedAt: serverTimestamp(),
      _updatedBy: rowyUser(currentUser),
      ...data,
    };
    if (missingRequiredFields.length === 0) {
      try {
        await db.collection(path).doc(newId).set(docData, { merge: true });
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

  const updateRow = (rowRef, update, onSuccess, onError) => {
    // const rowIndex = _findIndex(rows, { id: rowRef.id });
    // const row = _find(rows, { id: rowRef.id });
    // const { ref, _missingRequiredFields, ...rowData } = row;
    // // const _rows = [...rows];
    // // _rows[rowIndex] = { ...deepMerge(row, { ...deepen(update) }), ...update };

    // const missingRequiredFields = _missingRequiredFields
    //   ? _missingRequiredFields.reduce(missingFieldsReducer(row), [])
    //   : [];

    // if (missingRequiredFields.length === 0) {
    //   const _rowData = {
    //     ...deepMerge(rowData, { ...deepen(update) }),
    //     ...update,
    //   };
    //   ref.set(_rowData, { merge: true }).then(onSuccess, onError);
    //   delete _rows[rowIndex]._missingRequiredFields;
    // }

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
