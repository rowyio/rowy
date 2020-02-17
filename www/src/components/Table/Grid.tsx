import EmptyTable from "./EmptyTable";
import { editable } from "./grid-fns";

import Loading from "../Loading";

import { FieldType } from "constants/fields";
import { useSideDrawerContext } from "contexts/sideDrawerContext";

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

export interface IGridProps {
  columns: (Column<any> & {
    isNew?: boolean;
    type: FieldType;
    [key: string]: any;
  })[];
  [key: string]: any;
}

// const Grid = ({
//   onHeaderDrop,
//   rowHeight,
//   columns,
//   RowRenderer,
//   handleRowGetter,
//   tableHeight,
//   onGridRowsUpdated,
//   rows,
//   resizeColumn,
//   loadingRows,
//   addRow,
//   setSelectedCell,
// }: IGridProps) => {
//   const { setSelectedCell: contextSetSelectedCell } = useSideDrawerContext();

//   return (
//     <Suspense fallback={<Loading message="Loading table" />}>
//       <DraggableContainer onHeaderDrop={onHeaderDrop}>
//         <ReactDataGrid
//           headerRowHeight={47}
//           rowRenderer={RowRenderer}
//           rowHeight={rowHeight}
//           columns={columns}
//           enableCellSelect={true} // makes text based cells editable
//           rowGetter={handleRowGetter}
//           rowsCount={rows.length}
//           onGridRowsUpdated={onGridRowsUpdated}
//           minHeight={tableHeight}
//           onCellSelected={(coordinates: { rowIdx: number; idx: number }) => {
//             const row = rows[coordinates.rowIdx];
//             const column = columns[coordinates.idx];
//             if (editable(column.type)) {
//               //only editable fields are stored selectedCell, temporary fix for custom fields
//               setSelectedCell({ row, column });
//             }
//             if (contextSetSelectedCell) contextSetSelectedCell({ row });
//           }}
//           onColumnResize={(idx: number, width: number) =>
//             //tableActions.column.resize(idx, width)
//             resizeColumn(idx, width)
//           }
//           emptyRowsView={() => (
//             <EmptyTable
//               //isLoading={tableState.loadingRows}
//               isLoading={loadingRows}
//               tableHeight={tableHeight}
//               addRow={addRow}
//             />
//           )}
//         />
//       </DraggableContainer>
//     </Suspense>

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
  const { setSelectedCell: contextSetSelectedCell } = useSideDrawerContext();
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
      setSelectedCell({ row, column });
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
};

export default Grid;
