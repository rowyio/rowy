import useTable from "./useTable";
import useTableConfig from "./useTableConfig";

export type FiretableActions = {
  column: {
    add: Function;
    resize: Function;
    rename: Function;
    remove: Function;
    update: Function;
  };
  row: { add: any; delete: Function };
  set: Function;
  filter: Function;
};

export type FiretableState = {
  columns: any;
  rows: any;
};
export type FireTableFilter = {
  key: string;
  operator: "==" | "<" | ">" | ">=" | "<=" | string;
  value: any;
};

const useFiretable = (collectionName: string) => {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTable({
    path: collectionName,
  });

  const setTable = (collectionName: string, filters: FireTableFilter[]) => {
    configActions.setTable(collectionName);
    tableActions.setTable(collectionName, filters);
  };
  const filterTable = (filters: FireTableFilter[]) => {};

  const state: FiretableState = {
    columns: tableConfig.columns,
    rows: tableState.rows,
  };
  const actions: FiretableActions = {
    column: {
      add: configActions.add,
      resize: configActions.resize,
      rename: configActions.rename,
      update: configActions.update,
      remove: configActions.remove,
    },
    row: {
      add: tableActions.addRow,
      delete: tableActions.deleteRow,
    },
    set: setTable,
    filter: filterTable,
  };

  return { tableState: state, tableActions: actions };
};

export default useFiretable;
