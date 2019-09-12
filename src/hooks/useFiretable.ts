//TODO: consolidate useTable, useTableConfig, useCell into useFiretable

import { useEffect } from "react";
import useTable from "./useTable";
import useTableConfig from "./useTable";
import useCell from "./useCell";

const useFiretable = (collectionName: string) => {
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [table, tableActions] = useTable({
    path: collectionName
  });
  const setTable = (collectionName: string) => {
    configActions.setTable(collectionName);
    tableActions.setTable(collectionName);
  };
  const actions = { setTable: tableActions.setTable };
  return [table, actions];
};

export default useFiretable;
