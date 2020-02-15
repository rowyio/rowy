import EmptyTable from "./EmptyTable";
import { editable } from "./grid-fns";
import { DraggableHeader } from "react-data-grid-addons";
import Loading from "../Loading";

import "react-data-grid/dist/react-data-grid.css";

import React, { useState, useCallback, useRef } from "react";

import DataGrid, {
  Column,
  SelectColumn,
  UpdateActions,
  DataGridHandle,
  RowsUpdateEvent,
  CalculatedColumn,
  CellNavigationMode,
} from "react-data-grid";

function ImageFormatter({
  value,
}: {
  /** image url, used as background-image */
  value: string;
}) {
  return (
    <div className="rdg-image-cell-wrapper">
      <div
        className="rdg-image-cell"
        style={{ backgroundImage: `url(${value})` }}
      />
    </div>
  );
}

const { DraggableContainer } = DraggableHeader;
const Grid = (props: any) => {
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
    setSelectedCell,
  } = props;

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
      const newRows = [...rows];
      let start;
      let end;

      if (action === UpdateActions.COPY_PASTE) {
        start = toRow;
        end = toRow;
      } else {
        start = Math.min(fromRow, toRow);
        end = Math.max(fromRow, toRow);
      }

      for (let i = start; i <= end; i++) {
        newRows[i] = { ...newRows[i], ...updated };
      }
    },
    [rows]
  );

  const handleRowClick = useCallback(
    (rowIdx: number, row: any, column: CalculatedColumn<any>) => {
      if (column.key === "title") {
        gridRef.current?.openCellEditor(rowIdx, column.idx);
      }
    },
    []
  );

  return (
    <DataGrid
      ref={gridRef}
      columns={columns}
      rows={rows}
      rowKey="id"
      onRowsUpdate={handleRowUpdate}
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
};

export default Grid;
