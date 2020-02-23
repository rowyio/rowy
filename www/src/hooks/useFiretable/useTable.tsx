import { db } from "../../firebase";

import Button from "@material-ui/core/Button";
import React, { useEffect, useReducer, useContext } from "react";
import equals from "ramda/es/equals";
import firebase from "firebase/app";
import { FireTableFilter, FiretableOrderBy } from ".";
import { SnackContext } from "../../contexts/snackContext";

const CAP = 1000; // safety  paramter sets the  upper limit of number of docs fetched by this hook
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
var characters =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function makeId(length) {
  var result = "";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateSmallerId = (id: string) => {
  const indexOfFirstChar = characters.indexOf(id[0]);
  if (indexOfFirstChar !== 0)
    return characters[indexOfFirstChar - 1] + makeId(id.length - 1);
  else return id[0] + generateSmallerId(id.substr(1, id.length - 1));
};

const generateBiggerId = (id: string) => {
  const indexOfFirstChar = characters.indexOf(id[0]);
  if (indexOfFirstChar !== 61)
    return characters[indexOfFirstChar + 1] + makeId(id.length - 1);
  else return id[0] + generateBiggerId(id.substr(1, id.length - 1));
};

const tableReducer = (prevState: any, newProps: any) => {
  return { ...prevState, ...newProps };
};
const tableInitialState = {
  rows: [],
  prevFilters: null,
  prevPath: null,
  orderBy: null,
  prevOrderBy: null,
  path: null,
  filters: [],
  prevLimit: 0,
  limit: 20,
  loading: true,
  cap: CAP,
};

const useTable = (initialOverrides: any) => {
  const snackContext = useContext(SnackContext);

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
      | firebase.firestore.Query = db.collection(tableState.path);

    filters.forEach(filter => {
      query = query.where(filter.key, filter.operator, filter.value);
    });
    if (orderBy) {
      orderBy.forEach(order => {
        query = query.orderBy(order.key, order.direction);
      });
    }
    const unsubscribe = query.limit(limit).onSnapshot(
      snapshot => {
        if (snapshot.docs.length > 0) {
          const rows = snapshot.docs
            .map(doc => {
              const data = doc.data();
              const id = doc.id;
              const ref = doc.ref;

              return { ...data, id, ref };
            })
            .filter(doc => doc.id !== "_FIRETABLE_"); //removes schema file
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
      (error: Error) => {
        //TODO:callable to create new index
        if (error.message.includes("indexes?create_composite=")) {
          const url =
            `https://console.firebase.google.com/project/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/database/firestore/` +
            "indexes?create_composite=" +
            error.message.split("indexes?create_composite=")[1];

          snackContext.open({
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
      !equals(prevFilters, filters) ||
      prevLimit !== limit ||
      prevPath !== path ||
      prevOrderBy !== orderBy
    ) {
      if (path) getRows(filters, limit, orderBy);
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
    db.collection(tableState.path)
      .doc(documentId)
      .delete();
  };
  /**  used for setting up the table listener
   *  @param tableCollection firestore collection path
   *  @param filters specify filters to be applied to the query
   */
  const setTable = (tableCollection: string, filters?: FireTableFilter) => {
    if (tableCollection !== tableState.path) {
      tableDispatch({ path: tableCollection, rows: [] });
    }
    if (filters) tableDispatch({ filters });
  };

  /**  creating new document/row
   *  @param data(optional: default will create empty row)
   */
  const addRow = async (data?: any) => {
    const { rows, orderBy, path } = tableState;
    if (rows.length === 0) {
      await db.collection(path).add({
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...data,
      });
    } else {
      const firstId = rows[0].id;
      const newId = generateSmallerId(firstId);
      console.log(newId);
      await db
        .collection(path)
        .doc(newId)
        .set(
          {
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            ...data,
          },
          { merge: true }
        );
    }
  };
  /**  used for incrementing the number of rows fetched
   *  @param additionalRows number additional rows to be fetched (optional: default is 20)
   */
  const moreRows = (additionalRows?: number) => {
    tableDispatch({
      limit: tableState.limit + (additionalRows ? additionalRows : 20),
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
