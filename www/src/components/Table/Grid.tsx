import React, { useState, useCallback, useRef } from "react";

import EmptyTable from "./EmptyTable";
import { editable } from "./grid-fns";

import Loading from "../Loading";

import { FieldType } from "constants/fields";
import { useFiretableContext } from "contexts/firetableContext";

import "react-data-grid/dist/react-data-grid.css";

import DataGrid, {
  Column,
  SelectColumn,
  UpdateActions,
  DataGridHandle,
  RowsUpdateEvent,
  CalculatedColumn,
  CellNavigationMode,
} from "react-data-grid";

export interface IGridProps {
  columns: (Column<any> & {
    isNew?: boolean;
    type: FieldType;
    [key: string]: any;
  })[];
  [key: string]: any;
}

export default function Grid(props: any) {
  const {
    onHeaderDrop,
    rowHeight,
    columns,
    RowRenderer,
    handleRowGetter,
    tableHeight,
    tableWidth,
    onGridRowsUpdated,
    rows,
    resizeColumn,
    loadingRows,
    addRow,
  } = props;
  const { setSelectedCell } = useFiretableContext();
  //const [rows, setRows] = useState(() => createRows(2000));
  const [selectedRows, setSelectedRows] = useState(() => new Set<string>());
  const gridRef = useRef<DataGridHandle>(null);

  const handleRowUpdate = useCallback(
    ({
      fromRow,
      toRow,
      updated,
      action,
    }: RowsUpdateEvent<Partial<any>>): void => {
      console.log(fromRow, toRow, action, updated);
      // const newRows = [...rows];
      // let start;
      // let end;

      // if (action === UpdateActions.COPY_PASTE) {
      //   start = toRow;
      //   end = toRow;
      // } else {
      //   start = Math.min(fromRow, toRow);
      //   end = Math.max(fromRow, toRow);
      // }

      // for (let i = start; i <= end; i++) {
      //   newRows[i] = { ...newRows[i], ...updated };
      // }
    },
    [rows]
  );

  const handleRowClick = useCallback(
    (rowIdx: number, row: any, column: CalculatedColumn<any>) => {
      // TODO:
      if (setSelectedCell) setSelectedCell({ row: rowIdx, column: column.key });
      console.log(rowIdx, row, column);
    },
    []
  );

  return (
    <DataGrid
      ref={gridRef}
      columns={columns}
      rows={rows}
      rowKey="id"
      onRowsUpdate={props => {
        onGridRowsUpdated({ ...props, row: rows[props.toRow] });
      }}
      onRowClick={handleRowClick}
      rowHeight={rowHeight}
      width={tableWidth}
      height={tableHeight}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      enableCellCopyPaste
      enableCellDragAndDrop
      onColumnResize={resizeColumn} //TODO: maybe use debounce for performance
      cellNavigationMode={CellNavigationMode.CHANGE_ROW}
    />
  );
}
