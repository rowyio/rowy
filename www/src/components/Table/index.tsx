import React, { useEffect, useRef, useMemo, useState } from "react";
import _orderBy from "lodash/orderBy";
import _isEmpty from "lodash/isEmpty";
import _find from "lodash/find";
import _difference from "lodash/difference";
import _get from "lodash/get";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "react-data-grid/dist/react-data-grid.css";
import DataGrid, {
  Column,
  SelectColumn as _SelectColumn,
} from "react-data-grid";

import Loading from "components/Loading";
import TableHeader from "./TableHeader";
import ColumnHeader from "./ColumnHeader";
import ColumnMenu from "./ColumnMenu";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn from "./formatters/FinalColumn";
import BulkActions from "./BulkActions";

import { getFieldProp } from "components/fields";
import { FieldType } from "constants/fields";
import { formatSubTableName } from "utils/fns";

import { useAppContext } from "contexts/AppContext";
import { useFiretableContext } from "contexts/FiretableContext";
import useWindowSize from "hooks/useWindowSize";
import useStyles from "./styles";

export type FiretableColumn = Column<any> & {
  isNew?: boolean;
  type: FieldType;
  [key: string]: any;
};

const rowKeyGetter = (row: any) => row.id;
const SelectColumn = { ..._SelectColumn, width: 44, maxWidth: 44 };

export default function Table() {
  const classes = useStyles();

  const {
    tableState,
    tableActions,
    dataGridRef,
    sideDrawerRef,
    updateCell,
  } = useFiretableContext();
  const { userDoc } = useAppContext();

  const userDocHiddenFields =
    userDoc.state.doc?.tables?.[formatSubTableName(tableState?.tablePath)]
      ?.hiddenFields ?? [];

  const [columns, setColumns] = useState<FiretableColumn[]>([]);

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
          editable: true,
          resizable: true,
          frozen: column.fixed,
          headerRenderer: ColumnHeader,
          formatter:
            getFieldProp(
              "TableCell",
              column.config?.renderFieldType ?? column.type
            ) ??
            function InDev() {
              return null;
            },
          editor:
            getFieldProp(
              "TableEditor",
              column.config?.renderFieldType ?? column.type
            ) ??
            function InDev() {
              return null;
            },
          ...column,
          width: column.width ? (column.width > 380 ? 380 : column.width) : 150,
        }))
        .filter((column) => !userDocHiddenFields.includes(column.key));

      setColumns([
        // TODO: ENABLE ONCE BULK ACTIONS READY
        // SelectColumn,
        ..._columns,
        {
          isNew: true,
          key: "new",
          name: "Add column",
          type: FieldType.last,
          index: _columns.length ?? 0,
          width: 204,
          headerRenderer: FinalColumnHeader,
          headerCellClass: "final-column-header",
          cellClass: "final-column-cell",
          formatter: FinalColumn,
          editable: false,
        },
      ]);
    }
  }, [
    tableState?.loadingColumns,
    tableState?.columns,
    JSON.stringify(userDocHiddenFields),
  ]);

  const rows =
    useMemo(
      () =>
        tableState?.rows.map((row) =>
          columns.reduce(
            (acc, currColumn) => {
              if ((currColumn.key as string).includes(".")) {
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

  const rowHeight = tableState.config.rowHeight;

  return (
    <>
      {/* <Suspense fallback={<Loading message="Loading header" />}>
        <Hotkeys selectedCell={selectedCell} />
      </Suspense> */}
      <div className={classes.tableWrapper} ref={rowsContainerRef}>
        <TableHeader
          rowHeight={rowHeight}
          updateConfig={tableActions.table.updateConfig}
        />

        {!tableState.loadingColumns ? (
          <DndProvider backend={HTML5Backend}>
            <DataGrid
              onColumnResize={tableActions.column.resize}
              onScroll={handleScroll}
              ref={dataGridRef}
              rows={rows}
              columns={columns}
              rowHeight={rowHeight ?? 43}
              headerRowHeight={44}
              className="rdg-light" // Handle dark mode in MUI theme
              cellNavigationMode="LOOP_OVER_ROW"
              rowKeyGetter={rowKeyGetter}
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
              onRowsChange={(rows) => {
                //console.log('onRowsChange',rows)
              }}
              onFill={(e) => {
                console.log("onFill", e);
                const { columnKey, sourceRow, targetRows } = e;
                if (updateCell)
                  targetRows.forEach((row) =>
                    updateCell(row.ref, columnKey, sourceRow[columnKey])
                  );
                return [];
              }}
              onPaste={(e) => {
                const copiedValue = e.sourceRow[e.sourceColumnKey];
                if (updateCell) {
                  updateCell(e.targetRow.ref, e.targetColumnKey, copiedValue);
                }
              }}
              onRowClick={(rowIdx, column) => {
                if (sideDrawerRef?.current) {
                  sideDrawerRef.current.setCell({
                    row: rowIdx,
                    column: column.key as string,
                  });
                }
              }}
            />
          </DndProvider>
        ) : (
          <Loading message="Fetching columns" />
        )}
      </div>

      <ColumnMenu />
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
