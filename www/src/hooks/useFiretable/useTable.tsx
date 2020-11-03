import { db } from "../../firebase";

import Button from "@material-ui/core/Button";
import React, { useEffect, useReducer, useContext } from "react";
import equals from "ramda/es/equals";
import firebase from "firebase/app";
import { FireTableFilter, FiretableOrderBy, tablePath } from ".";
import { SnackContext } from "../../contexts/snackContext";
import { cloudFunction } from "../../firebase/callables";
import { isCollectionGroup, generateSmallerId } from "utils/fns";
const CAP = 1000; // safety  paramter sets the  upper limit of number of docs fetched by this hook
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

const tableReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};
const tableInitialState = {
  rows: [],
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

const useTable = (initialOverrides: any) => {
  const snack = useContext(SnackContext);

  const [tableState, tableDispatch] = useReducer(tableReducer, {
    ...tableInitialState,
    ...initialOverrides,
  });

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
    orderBy: FiretableOrderBy
  ) => {
    //unsubscribe from old path
    if (tableState.prevPath && tableState.path !== tableState.prevPath) {
      tableState.unsubscribe();
    }
    //updates previous values
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
      : db.collection(tablePath(tableState.path));

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
          const rows = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            const ref = doc.ref;
            return { ...data, id, ref };
          });
          tableDispatch({
            rows,
            loading: false,
          });
        } else {
          tableDispatch({
            rows: [],
            loading: false,
          });
        }
      },
      (error: any) => {
        //TODO:callable to create new index
        if (error?.message.includes("indexes?create_composite=")) {
          const url =
            `https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/database/firestore/` +
            "indexes?create_composite=" +
            error.message.split("indexes?create_composite=")[1];

          snack.open({
            severity: "error",
            message: "needs a new index",
            duration: 10000,
            action: (
              <Button
                onClick={() => {
                  window.open(url, "_blank");
                }}
              >
                create
              </Button>
            ),
          });
        } else if (error.code === "permission-denied") {
          if (filters.length === 0) {
            cloudFunction(
              "callable-setFiretablePersonalizedFilter",
              {
                table: tablePath(tableState.path),
              },
              (resp) => {
                console.log(resp);
              },
              () => {
                snack.open({
                  position: { horizontal: "center", vertical: "top" },
                  severity: "error",
                  message: "You don't have permissions to see the results.",
                  duration: 10000,
                });
              }
            );
          } else
            snack.open({
              position: { horizontal: "center", vertical: "top" },
              severity: "error",
              message: "You don't have permissions to see the results.",
              duration: 10000,
            });
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
        !equals(prevFilters, filters) ||
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
  const deleteRow = (rowIndex: number, documentId: string) => {
    //remove row locally
    tableState.rows.splice(rowIndex, 1);
    tableDispatch({ rows: tableState.rows });
    // delete document
    try {
      db.collection(tablePath(tableState.path)).doc(documentId).delete();
    } catch (error) {
      console.log(error);
      if (error.code === "permission-denied") {
        snack.open({
          severity: "error",
          message: "You don't have permissions to delete row",
          duration: 3000,
          position: { vertical: "top", horizontal: "center" },
        });
      }
    }
  };
  /**  used for setting up the table listener
   *  @param tableCollection firestore collection path
   *  @param filters specify filters to be applied to the query
   */
  const setTable = (tableCollection: string, filters?: FireTableFilter) => {
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
  const addRow = async (data?: any) => {
    const valuesFromFilter = tableState.filters.reduce(filterReducer, {});
    const { rows, path } = tableState;
    const docData = {
      ...valuesFromFilter,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    };
    try {
      if (rows.length === 0) {
        await db.collection(tablePath(path)).add(docData);
      } else {
        const firstId = rows[0].id;
        const newId = generateSmallerId(firstId);
        await db
          .collection(tablePath(path))
          .doc(newId)
          .set(docData, { merge: true });
      }
    } catch (error) {
      if (error.code === "permission-denied") {
        snack.open({
          severity: "error",
          message: "You don't have permissions to add a new row",
          duration: 3000,
          position: { vertical: "top", horizontal: "center" },
        });
      }
    }
  };
  /**  used for incrementing the number of rows fetched
   *  @param additionalRows number additional rows to be fetched (optional: default is 150)
   */
  const moreRows = (additionalRows?: number) => {
    // Don’t request more when already loading
    if (tableState.loading) return;

    // Don’t request more if none remaining.
    if (tableState.rows.length < tableState.limit) return;

    tableDispatch({
      limit: tableState.limit + (additionalRows ? additionalRows : 100),
    });
  };

  const tableActions = {
    deleteRow,
    setTable,
    addRow,
    moreRows,
    dispatch: tableDispatch,
  };
  return [tableState, tableActions];
};

export default useTable;
