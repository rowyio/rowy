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
};

export type FiretableState = {
  columns: any;
  rows: any;
};

const useFiretable = (collectionName: string) => {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTable({
    path: collectionName,
  });

  const setTable = (collectionName: string) => {
    configActions.setTable(collectionName);
    tableActions.setTable(collectionName);
  };
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
  };

  return { tableState: state, tableActions: actions };
};

export default useFiretable;
