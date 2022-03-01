import React, { useEffect, useRef, useMemo, useState } from "react";
import _orderBy from "lodash/orderBy";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _difference from "lodash/difference";
import _get from "lodash/get";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import "react-data-grid/dist/react-data-grid.css";
import DataGrid, {
  Column,
  //  SelectColumn as _SelectColumn,
} from "react-data-grid";

import Loading from "@src/components/Loading";
import TableContainer, { OUT_OF_ORDER_MARGIN } from "./TableContainer";
import TableHeader from "../TableHeader";
import ColumnHeader from "./ColumnHeader";
import ColumnMenu from "./ColumnMenu";
import ContextMenu from "./ContextMenu";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn from "./formatters/FinalColumn";
import TableRow from "./TableRow";
import BulkActions from "./BulkActions";

import { getColumnType, getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { formatSubTableName } from "@src/utils/fns";

import { useAppContext } from "@src/contexts/AppContext";
import { useProjectContext } from "@src/contexts/ProjectContext";
import useWindowSize from "@src/hooks/useWindowSize";
import { useSetSelectedCell } from "@src/atoms/ContextMenu";

export type TableColumn = Column<any> & {
  isNew?: boolean;
  type: FieldType;
  [key: string]: any;
};

const rowKeyGetter = (row: any) => row.id;
const rowClass = (row: any) => (row._rowy_outOfOrder ? "out-of-order" : "");
//const SelectColumn = { ..._SelectColumn, width: 42, maxWidth: 42 };

export default function Table() {
  const {
    table,
    tableState,
    tableActions,
    dataGridRef,
    sideDrawerRef,
    updateCell,
  } = useProjectContext();
  const { userDoc, userClaims } = useAppContext();
  const { setSelectedCell } = useSetSelectedCell();

  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[formatSubTableName(tableState?.config.id)]
      ?.hiddenFields ?? [];

  const [columns, setColumns] = useState<TableColumn[]>([]);

  useEffect(() => {
    if (!tableState?.loadingColumns && tableState?.columns) {
      const _columns = _orderBy(
        Object.values(tableState?.columns).filter(
          (column: any) => !column.hidden && column.key
        ),
        "index"
      )
        .map((column: any) => ({
          draggable: true,
          resizable: true,
          frozen: column.fixed,
          headerRenderer: ColumnHeader,
          formatter:
            getFieldProp("TableCell", getColumnType(column)) ??
            function InDev() {
              return null;
            },
          editor:
            getFieldProp("TableEditor", getColumnType(column)) ??
            function InDev() {
              return null;
            },
          ...column,
          editable:
            table?.readOnly && !userClaims?.roles.includes("ADMIN")
              ? false
              : column.editable ?? true,
          width: (column.width as number)
            ? (column.width as number) > 380
              ? 380
              : (column.width as number)
            : 150,
        }))
        .filter((column) => !userDocHiddenFields.includes(column.key));

      if (!table?.readOnly || userClaims?.roles.includes("ADMIN")) {
        _columns.push({
          isNew: true,
          key: "new",
          name: "Add column",
          type: FieldType.last,
          index: _columns.length ?? 0,
          width: 154,
          headerRenderer: FinalColumnHeader,
          headerCellClass: "final-column-header",
          cellClass: "final-column-cell",
          formatter: FinalColumn,
          editable: false,
        });
      }

      setColumns(_columns);

      // setColumns([
      //   //  SelectColumn,
      //   ..._columns,
      //   ,
      // ]);
    }
  }, [
    tableState?.loadingColumns,
    tableState?.columns,
    JSON.stringify(userDocHiddenFields),
    table?.readOnly,
    userClaims?.roles,
  ]);

  const rows =
    useMemo(
      () =>
        tableState?.rows.map((row) =>
          columns.reduce(
            (acc, currColumn) => {
              if (currColumn.key.includes(".")) {
                return {
                  ...acc,
                  [currColumn.key]: _get(row, currColumn.key),
                };
              } else return acc;
            },
            { ...row, id: row.id as string, ref: row.ref }
          )
        ),
      [columns, tableState?.rows]
    ) ?? [];

  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const [selectedRowsSet, setSelectedRowsSet] = useState<Set<React.Key>>();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  // Gets more rows when scrolled down.
  // https://github.com/adazzle/react-data-grid/blob/ead05032da79d7e2b86e37cdb9af27f2a4d80b90/stories/demos/AllFeatures.tsx#L60
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const offset = 800;
    const isAtBottom =
      target.clientHeight + target.scrollTop >= target.scrollHeight - offset;

    if (!isAtBottom) return;

    // Prevent calling more rows when they’ve already been called
    if (tableState!.loadingRows) return;

    // Call for 30 more rows. Note we don’t know here if there are no more
    // rows left in the database. This is done in the useTable hook.
    tableActions?.row.more(30);
  };

  const windowSize = useWindowSize();
  if (!windowSize || !windowSize.height) return <></>;

  if (!tableActions || !tableState) return <></>;

  const rowHeight = tableState.config.rowHeight ?? 42;

  return (
    <>
      {/* <Suspense fallback={<Loading message="Loading header" />}>
        <Hotkeys selectedCell={selectedCell} />
      </Suspense> */}
      <TableContainer ref={rowsContainerRef} rowHeight={rowHeight}>
        <TableHeader />

        {!tableState.loadingColumns ? (
          <DndProvider backend={HTML5Backend}>
            <DataGrid
              onColumnResize={tableActions.column.resize}
              onScroll={handleScroll}
              ref={dataGridRef}
              rows={rows}
              columns={columns}
              // Increase row height of out of order rows to add margins
              rowHeight={({ row }) => {
                if (row._rowy_outOfOrder)
                  return rowHeight + OUT_OF_ORDER_MARGIN + 1;

                return rowHeight;
              }}
              headerRowHeight={42}
              className="rdg-light" // Handle dark mode in MUI theme
              cellNavigationMode="LOOP_OVER_ROW"
              rowRenderer={TableRow}
              rowKeyGetter={rowKeyGetter}
              rowClass={rowClass}
              selectedRows={selectedRowsSet}
              onSelectedRowsChange={(newSelectedSet) => {
                const newSelectedArray = newSelectedSet
                  ? [...newSelectedSet]
                  : [];
                const prevSelectedRowsArray = selectedRowsSet
                  ? [...selectedRowsSet]
                  : [];
                const addedSelections = _difference(
                  newSelectedArray,
                  prevSelectedRowsArray
                );
                const removedSelections = _difference(
                  prevSelectedRowsArray,
                  newSelectedArray
                );
                addedSelections.forEach((id) => {
                  const newRow = _find(rows, { id });
                  setSelectedRows([...selectedRows, newRow]);
                });
                removedSelections.forEach((rowId) => {
                  setSelectedRows(
                    selectedRows.filter((row) => row.id !== rowId)
                  );
                });
                setSelectedRowsSet(newSelectedSet);
              }}
              // onRowsChange={() => {
              //console.log('onRowsChange',rows)
              // }}
              // TODO: onFill={(e) => {
              //   console.log("onFill", e);
              //   const { columnKey, sourceRow, targetRows } = e;
              //   if (updateCell)
              //     targetRows.forEach((row) =>
              //       updateCell(row.ref, columnKey, sourceRow[columnKey])
              //     );
              //   return [];
              // }}
              onPaste={(e) => {
                const copiedValue = e.sourceRow[e.sourceColumnKey];
                if (updateCell) {
                  updateCell(e.targetRow.ref, e.targetColumnKey, copiedValue);
                }
              }}
              onRowClick={(row, column) => {
                if (sideDrawerRef?.current) {
                  sideDrawerRef.current.setCell({
                    row: _findIndex(tableState.rows, { id: row.id }),
                    column: column.key,
                  });
                }
              }}
              onSelectedCellChange={({ rowIdx, idx }) =>
                setSelectedCell({
                  rowIndex: rowIdx,
                  colIndex: idx,
                })
              }
            />
          </DndProvider>
        ) : (
          <Loading message="Fetching columns" />
        )}
      </TableContainer>

      <ColumnMenu />
      <ContextMenu />
      <BulkActions
        selectedRows={selectedRows}
        columns={columns}
        clearSelection={() => {
          setSelectedRowsSet(new Set());
          setSelectedRows([]);
        }}
      />
    </>
  );
}
