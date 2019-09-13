import { db } from "../firebase";

import { useEffect, useReducer } from "react";
import equals from "ramda/es/equals";
import { Cell } from "./useCell";
import firebase from "firebase/app";
const CAP = 500;

const tableReducer = (prevState: any, newProps: any) => {
  if (newProps.type) {
    switch (newProps.type) {
      case "more":
        if (prevState.limit < prevState.cap)
          // rows count hardcap
          return { ...prevState, limit: prevState.limit + 10 };
        else return { ...prevState };
      default:
        break;
    }
  } else {
    return { ...prevState, ...newProps };
  }
};
const tableIntialState = {
  rows: [],
  prevFilters: null,
  prevPath: null,
  path: null,
  filters: [],
  prevLimit: 0,
  limit: 20,
  loading: true,
  sort: { field: "createdAt", direction: "asc" },
  cap: CAP
};

const useTable = (intialOverrides: any) => {
  const [tableState, tableDispatch] = useReducer(tableReducer, {
    ...tableIntialState,
    ...intialOverrides
  });
  const getRows = (
    filters: {
      field: string;
      operator: "==" | "<" | ">" | ">=" | "<=";
      value: string;
    }[],
    limit: number,
    sort:
      | { field: string; direction: "asc" | "desc" }[]
      | { field: string; direction: "asc" | "desc" }
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
      loading: true
    });
    let query:
      | firebase.firestore.CollectionReference
      | firebase.firestore.Query = db.collection(tableState.path);

    filters.forEach(filter => {
      query = query.where(filter.field, filter.operator, filter.value);
    });
    if (sort) {
      if (Array.isArray(sort)) {
        sort.forEach(order => {
          query = query.orderBy(order.field, order.direction);
        });
      } else {
        query = query.orderBy(sort.field, sort.direction);
      }
    }
    const unsubscribe = query.limit(limit).onSnapshot(snapshot => {
      if (snapshot.docs.length > 0) {
        const rows = snapshot.docs
          .map(doc => {
            const data = doc.data();
            const id = doc.id;
            return { ...data, id };
          })
          .filter(doc => doc.id !== "_FIRETABLE_"); //removes schema file
        tableDispatch({
          rows,
          loading: false
        });
      } else {
        tableDispatch({
          rows: [],
          loading: false
        });
      }
    });
    tableDispatch({ unsubscribe });
  };
  useEffect(() => {
    const {
      prevFilters,
      filters,
      prevLimit,
      limit,
      prevPath,
      path,
      sort,
      unsubscribe
    } = tableState;
    if (
      !equals(prevFilters, filters) ||
      prevLimit !== limit ||
      prevPath !== path
    ) {
      if (path) getRows(filters, limit, sort);
    }
    return () => {
      if (unsubscribe) {
        tableState.unsubscribe();
      }
    };
  }, [tableState.filters, tableState.limit, tableState.path]);
  const deleteRow = (rowIndex: number, documentId: string) => {
    //remove row locally
    tableState.rows.splice(rowIndex, 1);
    tableDispatch({ rows: tableState.rows });
    // delete document
    db.collection(tableState.path)
      .doc(documentId)
      .delete();
  };
  const setTable = (tableCollection: string) => {
    tableDispatch({ path: tableCollection });
  };
  const updateCell = (cell: Cell) => {
    console.log("updateCell:", cell);
    // TODO: update row locally
    // tableState.rows[cell.rowIndex][cell.fieldName] = cell.value;
    // tableDispatch({ rows: tableState.rows });

    // update document
    db.collection(tableState.path)
      .doc(cell.docId)
      .update({ [cell.fieldName]: cell.value });
  };
  const addRow = () => {
    db.collection(tableState.path).add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  };
  const tableActions = { deleteRow, setTable, updateCell, addRow };
  return [tableState, tableActions];
};

export default useTable;
