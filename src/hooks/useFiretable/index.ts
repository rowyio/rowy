import useTable from "./useTable";
import useTableConfig from "./useTableConfig";
import useCell, { Cell } from "./useCell";

export type FiretableActions = {
  cell: { set: Function; update: Function };
  column: { add: Function };
  row: { add: any; delete: Function };
  table: { set: Function };
};

export type FiretableState = {
  cell: Cell;
  columns: any;
  rows: any;
};

const useFiretable = (collectionName: string) => {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTable({
    path: collectionName
  });
  const [cellState, cellActions] = useCell({
    updateCell: tableActions.updateCell
  });
  const setTable = (collectionName: string) => {
    configActions.setTable(collectionName);
    tableActions.setTable(collectionName);
    cellActions.set(null);
  };
  console.log("tableState", tableConfig);
  const state: FiretableState = {
    cell: cellState.cell,
    columns: tableConfig.columns,
    rows: tableState.rows
  };
  const actions: FiretableActions = {
    cell: { ...cellActions },
    column: { add: configActions.addColumn },
    row: { add: tableActions.addRow, delete: tableActions.deleteRow },
    table: { set: setTable }
  };

  return { tableState: state, tableActions: actions };
};

export default useFiretable;
