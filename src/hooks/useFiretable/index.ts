import { useEffect } from "react";
import useTable from "./useTable";
import useTableConfig from "./useTableConfig";
import useCell, { Cell } from "./useCell";

import useKeyCode from "./useKeyCode";
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
  const moveDown = useKeyCode(40);
  const moveUp = useKeyCode(38);
  const tab = useKeyCode(9);
  const [tableConfig, configActions] = useTableConfig(collectionName);
  const [tableState, tableActions] = useTable({
    path: collectionName
  });
  const [cellState, cellActions] = useCell({
    updateCell: tableActions.updateCell
  });

  //TODO: move focus to cell above on down key
  useEffect(() => {
    if (cellState.cell) {
    }
  }, [tab]);
  // move focus to cell above on down key
  useEffect(() => {
    if (cellState.cell) {
      if (cellState.cell.rowIndex !== 0) {
        const nextRowIndex = cellState.cell.rowIndex - 1;
        cellActions.set({
          fieldName: cellState.cell.fieldName,
          rowIndex: nextRowIndex,
          value: tableState.rows[nextRowIndex].value
        });
      }
    }
  }, [moveUp]);

  // move focus to cell bellow on down up
  useEffect(() => {
    if (cellState.cell) {
      if (cellState.cell.rowIndex === tableState.rows.length - 1) {
        // reach last row creating new row
        tableActions.addRow();
      } else {
        const nextRowIndex = cellState.cell.rowIndex + 1;
        cellActions.set({
          fieldName: cellState.cell.fieldName,
          rowIndex: nextRowIndex,
          value: tableState.rows[nextRowIndex].value
        });
      }
    }
  }, [moveDown]);
  const setTable = (collectionName: string) => {
    configActions.setTable(collectionName);
    tableActions.setTable(collectionName);
    cellActions.set(null);
  };
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
