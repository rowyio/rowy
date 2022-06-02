import React, { useMemo, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// import "react-data-grid/dist/react-data-grid.css";
import DataGrid, {
  Column,
  DataGridHandle,
  //  SelectColumn as _SelectColumn,
} from "react-data-grid";
import { LinearProgress } from "@mui/material";

import TableContainer, { OUT_OF_ORDER_MARGIN } from "./TableContainer";
import ColumnHeader, { COLUMN_HEADER_HEIGHT } from "./ColumnHeader";
// import ContextMenu from "./ContextMenu";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn from "./formatters/FinalColumn";
import TableRow from "./TableRow";
import EmptyState from "@src/components/EmptyState";
// import BulkActions from "./BulkActions";
import AddRow from "@src/components/TableToolbar/AddRow";
import { AddRow as AddRowIcon } from "@src/assets/icons";

import {
  globalScope,
  userRolesAtom,
  userSettingsAtom,
  navPinnedAtom,
} from "@src/atoms/globalScope";
import {
  tableScope,
  tableIdAtom,
  tableSettingsAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
  tableRowsAtom,
  tableNextPageAtom,
  tablePageAtom,
  updateColumnAtom,
  updateFieldAtom,
  selectedCellAtom,
} from "@src/atoms/tableScope";

import { getFieldType, getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { formatSubTableName } from "@src/utils/table";
import { ColumnConfig } from "@src/types/table";

export type DataGridColumn = ColumnConfig & Column<any> & { isNew?: true };
export const DEFAULT_ROW_HEIGHT = 41;

const rowKeyGetter = (row: any) => row.id;
const rowClass = (row: any) => (row._rowy_outOfOrder ? "out-of-order" : "");
//const SelectColumn = { ..._SelectColumn, width: 42, maxWidth: 42 };

export default function Table({
  dataGridRef,
}: {
  dataGridRef?: React.MutableRefObject<DataGridHandle | null>;
}) {
  const [userRoles] = useAtom(userRolesAtom, globalScope);
  const [userSettings] = useAtom(userSettingsAtom, globalScope);
  const [navPinned] = useAtom(navPinnedAtom, globalScope);

  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const setTablePage = useSetAtom(tablePageAtom, tableScope);
  const setSelectedCell = useSetAtom(selectedCellAtom, tableScope);

  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields;

  // Get column configs from table schema and map them to DataGridColumns
  // Also filter out hidden columns and add end column
  const columns = useMemo(() => {
    const _columns: DataGridColumn[] = tableColumnsOrdered
      .filter((column) => {
        if (column.hidden) return false;
        if (
          Array.isArray(userDocHiddenFields) &&
          userDocHiddenFields.includes(column.key)
        )
          return false;
        return true;
      })
      .map((column: any) => ({
        draggable: true,
        resizable: true,
        frozen: column.fixed,
        headerRenderer: ColumnHeader,
        formatter:
          getFieldProp("TableCell", getFieldType(column)) ??
          function InDev() {
            return null;
          },
        editor:
          getFieldProp("TableEditor", getFieldType(column)) ??
          function InDev() {
            return null;
          },
        ...column,
        editable:
          tableSettings.readOnly && !userRoles.includes("ADMIN")
            ? false
            : column.editable ?? true,
        width: (column.width as number)
          ? (column.width as number) > 380
            ? 380
            : (column.width as number)
          : 150,
      }));

    if (userRoles.includes("ADMIN") || !tableSettings.readOnly) {
      _columns.push({
        isNew: true,
        key: "new",
        fieldName: "_rowy_new",
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

    return _columns;
  }, [
    tableColumnsOrdered,
    userDocHiddenFields,
    tableSettings.readOnly,
    userRoles,
  ]);

  // Handle columns with field names that use dot notation (nested fields)
  const rows =
    useMemo(() => {
      // const columnsWithNestedFieldNames = columns
      //   .map((col) => col.fieldName)
      //   .filter((fieldName) => fieldName.includes("."));

      // if (columnsWithNestedFieldNames.length === 0)
      return tableRows;

      // return tableRows.map((row) =>
      //   columnsWithNestedFieldNames.reduce(
      //     (acc, fieldName) => ({
      //       ...acc,
      //       [fieldName]: get(row, fieldName),
      //     }),
      //     { ...row }
      //   )
      // );
    }, [tableRows]) ?? [];

  // const [selectedRowsSet, setSelectedRowsSet] = useState<Set<React.Key>>();
  // const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // Gets more rows when scrolled down.
  // https://github.com/adazzle/react-data-grid/blob/ead05032da79d7e2b86e37cdb9af27f2a4d80b90/stories/demos/AllFeatures.tsx#L60
  const handleScroll = useThrottledCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;

      if (navPinned && !columns[0].fixed)
        setShowLeftScrollDivider(target.scrollLeft > 16);

      const offset = 800;
      const isAtBottom =
        target.clientHeight + target.scrollTop >= target.scrollHeight - offset;
      if (!isAtBottom) return;
      // Call for the next page
      setTablePage((p) => p + 1);
    },
    250
  );

  const [showLeftScrollDivider, setShowLeftScrollDivider] = useState(false);

  const rowHeight = tableSchema.rowHeight ?? DEFAULT_ROW_HEIGHT;
  const handleResize = useDebouncedCallback(
    (colIndex: number, width: number) => {
      const column = columns[colIndex];
      if (!column.key) return;
      updateColumn({ key: column.key, config: { width } });
    },
    1000
  );

  return (
    <>
      {/* <Suspense fallback={<Loading message="Loading header" />}>
        <Hotkeys selectedCell={selectedCell} />
      </Suspense> */}
      <TableContainer rowHeight={rowHeight}>
        <DndProvider backend={HTML5Backend}>
          {showLeftScrollDivider && <div className="left-scroll-divider" />}

          <DataGrid
            onColumnResize={handleResize}
            onScroll={handleScroll}
            ref={(handle) => {
              if (dataGridRef) dataGridRef.current = handle;
            }}
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
            // selectedRows={selectedRowsSet}
            // onSelectedRowsChange={(newSelectedSet) => {
            //   const newSelectedArray = newSelectedSet
            //     ? [...newSelectedSet]
            //     : [];
            //   const prevSelectedRowsArray = selectedRowsSet
            //     ? [...selectedRowsSet]
            //     : [];
            //   const addedSelections = difference(
            //     newSelectedArray,
            //     prevSelectedRowsArray
            //   );
            //   const removedSelections = difference(
            //     prevSelectedRowsArray,
            //     newSelectedArray
            //   );
            //   addedSelections.forEach((id) => {
            //     const newRow = find(rows, { id });
            //     setSelectedRows([...selectedRows, newRow]);
            //   });
            //   removedSelections.forEach((rowId) => {
            //     setSelectedRows(selectedRows.filter((row) => row.id !== rowId));
            //   });
            //   setSelectedRowsSet(newSelectedSet);
            // }}
            // onRowsChange={() => {
            //console.log('onRowsChange',rows)
            // }}
            // FIXME: onFill={(e) => {
            //   console.log("onFill", e);
            //   const { columnKey, sourceRow, targetRows } = e;
            //   if (updateCell)
            //     targetRows.forEach((row) =>
            //       updateCell(row.ref, columnKey, sourceRow[columnKey])
            //     );
            //   return [];
            // }}
            onPaste={(e) => {
              const value = e.sourceRow[e.sourceColumnKey];
              updateField({
                path: e.targetRow._rowy_ref.path,
                fieldName: e.targetColumnKey,
                value,
              });
            }}
            onSelectedCellChange={({ rowIdx, idx }) =>
              setSelectedCell({
                path: rows[rowIdx]._rowy_ref.path,
                columnKey: tableColumnsOrdered.filter((col) =>
                  userDocHiddenFields
                    ? !userDocHiddenFields.includes(col.key)
                    : true
                )[idx].key,
              })
            }
          />
        </DndProvider>

        {tableRows.length === 0 && (
          <EmptyState
            Icon={AddRowIcon}
            message="Add a row to get started"
            description={
              <div>
                <br />
                <AddRow />
              </div>
            }
            style={{
              position: "absolute",
              inset: 0,
              top: COLUMN_HEADER_HEIGHT,
              height: "auto",
            }}
          />
        )}
        {tableNextPage.loading && <LinearProgress />}
      </TableContainer>

      {/* <ContextMenu />
      <BulkActions
        selectedRows={selectedRows}
        columns={columns}
        clearSelection={() => {
          setSelectedRowsSet(new Set());
          setSelectedRows([]);
        }}
      /> */}
    </>
  );
}
