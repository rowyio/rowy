import useTableData from "./useTableData";
import useTableConfig from "./useTableConfig";
export type TableActions = {
  // TODO: Stricter types here
  column: {
    add: Function;
    insert: Function;
    resize: (index: number, width: number) => void;
    rename: Function;
    remove: Function;
    update: Function;
    reorder: Function;
  };
  addRows: Function;
  row: { add: Function; delete: Function; more: Function; update: Function };
  table: {
    set: (id: string, collection: string, filters: TableFilter[]) => void;
    filter: Function;
    updateConfig: (key: string, value: any, callback?: Function) => void;
    orderBy: Function;
  };
};

export type TableState = {
  orderBy: TableOrder;
  tablePath: string;
  config: {
    id: string;
    rowHeight: number;
    tableConfig: any;
    sparks: string;
    compiledExtension: string;
    extensionObjects?: any[];
    webhooks?: any[];
    functionConfigPath?: string;
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

export default function useTable() {
  const [tableConfig, configActions] = useTableConfig();
  const [tableState, tableActions] = useTableData();

  /** set collection path of table */
  const setTable = (id: string, collection: string, filters: TableFilter[]) => {
    if (collection !== tableState.path || filters !== tableState.filters) {
      configActions.setTable(id);
      // Wait for config doc to load to get collection path
      tableActions.setTable(collection, filters);
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
      id: tableConfig.id,
      rowHeight: tableConfig.rowHeight,
      webhooks: tableConfig.doc?.webhooks,
      sparks: tableConfig.doc?.sparks,
      compiledExtension: tableConfig.doc?.compiledExtension,
      extensionObjects: tableConfig.doc?.extensionObjects,
      functionConfigPath: tableConfig.doc?.functionConfigPath,
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
      insert: configActions.insert,
      resize: configActions.resize,
      rename: configActions.rename,
      update: configActions.updateColumn,
      remove: configActions.remove,
      reorder: configActions.reorder,
    },
    addRows: tableActions.addRows,
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
