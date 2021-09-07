import useTableData from "./useTableData";
import useTableConfig from "./useTableConfig";

export type TableActions = {
  // TODO: Stricter types here
  column: {
    add: Function;
    resize: (index: number, width: number) => void;
    rename: Function;
    remove: Function;
    update: Function;
    reorder: Function;
  };
  row: { add: Function; delete: Function; more: Function; update: Function };
  table: {
    set: Function;
    filter: Function;
    updateConfig: Function;
    orderBy: Function;
  };
};

export type TableState = {
  orderBy: TableOrder;
  tablePath: string;
  config: {
    rowHeight: number;
    tableConfig: any;
    webhooks: any;
    sparks: string;
    compiledExtension: string;
    extensionObjects?: any[];
  };
  columns: any[];
  rows: { [key: string]: any }[];
  queryLimit: number;
  filters: TableFilter[];
  loadingRows: boolean;
  loadingColumns: boolean;
};
export type TableFilter = {
  key: string;
  operator: "==" | "<" | ">" | ">=" | "<=" | string;
  value: string | number | boolean | string[];
};
export type TableOrder = { key: string; direction: "asc" | "desc" }[];

export default function useTable(
  collectionName?: string,
  filters?: TableFilter[],
  orderBy?: TableOrder
) {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTableData({
    path: collectionName,
    filters,
    orderBy,
  });

  /** set collection path of table */
  const setTable = (collectionName: string, filters: TableFilter[]) => {
    if (collectionName !== tableState.path || filters !== tableState.filters) {
      configActions.setTable(collectionName);
      tableActions.setTable(collectionName, filters);
    }
  };
  const filterTable = (filters: TableFilter[]) => {
    tableActions.dispatch({ filters });
  };
  const setOrder = (orderBy: TableOrder) => {
    tableActions.dispatch({ orderBy });
  };
  const state: TableState = {
    orderBy: tableState.orderBy,
    tablePath: tableState.path,
    filters: tableState.filters,
    columns: tableConfig.columns,
    config: {
      rowHeight: tableConfig.rowHeight,
      webhooks: tableConfig.doc?.webhooks,
      sparks: tableConfig.doc?.sparks,
      compiledExtension: tableConfig.doc?.compiledExtension,
      extensionObjects: tableConfig.doc?.extensionObjects,
      tableConfig,
    },
    rows: tableState.rows,
    queryLimit: tableState.limit,
    loadingRows: tableState.loading,
    loadingColumns: tableConfig.loading,
  };
  const actions: TableActions = {
    column: {
      add: configActions.addColumn,
      resize: configActions.resize,
      rename: configActions.rename,
      update: configActions.updateColumn,
      remove: configActions.remove,
      reorder: configActions.reorder,
    },
    row: {
      add: tableActions.addRow,
      update: tableActions.updateRow,
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
}
