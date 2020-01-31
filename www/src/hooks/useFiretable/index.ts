import useTable from "./useTable";
import useTableConfig from "./useTableConfig";

export type FiretableActions = {
  column: {
    add: Function;
    resize: Function;
    rename: Function;
    remove: Function;
    update: Function;
    reorder: Function;
  };
  row: { add: Function; delete: Function; more: Function };
  table: {
    set: Function;
    filter: Function;
    updateConfig: Function;
    orderBy: Function;
  };
};

export type FiretableState = {
  config: { rowHeight: number };
  columns: any[];
  rows: any[];
  rowsLimit: number;

  loadingRows: boolean;
  loadingColumns: boolean;
};
export type FireTableFilter = {
  key: string;
  operator: "==" | "<" | ">" | ">=" | "<=" | string;
  value: string | number | boolean | string[];
};
export type FiretableOrderBy = { key: string; direction: "asc" | "desc" }[];
const useFiretable = (
  collectionName: string,
  filters?: FireTableFilter[],
  orderBy?: FiretableOrderBy
) => {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTable({
    path: collectionName,
    filters,
    orderBy,
  });
  /** set collection path of table */
  const setTable = (
    collectionName: string,
    filters: FireTableFilter[],
    orderBy: FiretableOrderBy
  ) => {
    if (collectionName !== tableState.path || filters !== tableState.filters) {
      configActions.setTable(collectionName);
      tableActions.setTable(collectionName, filters);
    }
  };
  const filterTable = (filters: FireTableFilter[]) => {
    tableActions.dispatch({ filters });
  };
  const setOrder = (orderBy: FiretableOrderBy) => {
    tableActions.dispatch({ orderBy });
  };
  const state: FiretableState = {
    columns: tableConfig.columns,
    config: { rowHeight: tableConfig.rowHeight },
    rows: tableState.rows,
    rowsLimit: tableState.limit,
    loadingRows: tableState.loading,
    loadingColumns: tableConfig.loading,
  };
  const actions: FiretableActions = {
    column: {
      add: configActions.add,
      resize: configActions.resize,
      rename: configActions.rename,
      update: configActions.updateColumn,
      remove: configActions.remove,
      reorder: configActions.reorder,
    },
    row: {
      add: tableActions.addRow,
      delete: tableActions.deleteRow,
      more: tableActions.moreRows,
    },
    table: {
      updateConfig: configActions.updateConfig,
      set: setTable,
      orderBy: setOrder,
      filter: filterTable,
    },
  };

  return { tableState: state, tableActions: actions };
};

export default useFiretable;
