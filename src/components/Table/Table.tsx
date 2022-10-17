import React, { useMemo, useState, Suspense, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { findIndex } from "lodash-es";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";
import { StyledTable } from "./Styled/StyledTable";
import { StyledRow } from "./Styled/StyledRow";
import ColumnHeaderComponent from "./Column";

import { LinearProgress } from "@mui/material";

import TableContainer, { OUT_OF_ORDER_MARGIN } from "./TableContainer";
import ColumnHeader, { COLUMN_HEADER_HEIGHT } from "./ColumnHeader";
import FinalColumnHeader from "./FinalColumnHeader";
import FinalColumn from "./formatters/FinalColumn";
// import TableRow from "./TableRow";
import EmptyState from "@src/components/EmptyState";
// import BulkActions from "./BulkActions";
import AddRow from "@src/components/TableToolbar/AddRow";
import { AddRow as AddRowIcon } from "@src/assets/icons";
import Loading from "@src/components/Loading";
import ContextMenu from "./ContextMenu";

import {
  projectScope,
  userRolesAtom,
  userSettingsAtom,
} from "@src/atoms/projectScope";
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
  SelectedCell,
} from "@src/atoms/tableScope";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";

import { getFieldType, getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { formatSubTableName } from "@src/utils/table";
import { TableRow, ColumnConfig } from "@src/types/table";
import { StyledCell } from "./Styled/StyledCell";

export const DEFAULT_ROW_HEIGHT = 41;
export const DEFAULT_COL_WIDTH = 150;
export const MAX_COL_WIDTH = 380;

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData, TValue> extends ColumnConfig {}
}

const columnHelper = createColumnHelper<TableRow>();
const getRowId = (row: TableRow) => row._rowy_ref.path || row._rowy_ref.id;

export default function TableComponent() {
  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);

  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const setTablePage = useSetAtom(tablePageAtom, tableScope);
  const [selectedCell, setSelectedCell] = useAtom(selectedCellAtom, tableScope);

  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const gridRef = useRef<HTMLDivElement>(null);
  const [focusInsideCell, setFocusInsideCell] = useState(false);

  const canAddColumn = userRoles.includes("ADMIN");
  const canEditColumn = userRoles.includes("ADMIN");
  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields;

  // Get column defs from table schema
  // Also add end column for admins
  const columns = useMemo(() => {
    const _columns = tableColumnsOrdered
      // .filter((column) => {
      //   if (column.hidden) return false;
      //   if (
      //     Array.isArray(userDocHiddenFields) &&
      //     userDocHiddenFields.includes(column.key)
      //   )
      //     return false;
      //   return true;
      // })
      .map((columnConfig) =>
        columnHelper.accessor(columnConfig.fieldName, {
          id: columnConfig.fieldName,
          meta: columnConfig,
          // draggable: true,
          // resizable: true,
          // frozen: columnConfig.fixed,
          // headerRenderer: ColumnHeader,
          // formatter:
          //   getFieldProp("TableCell", getFieldType(columnConfig)) ??
          //   function InDev() {
          //     return null;
          //   },
          // editor:
          //   getFieldProp("TableEditor", getFieldType(columnConfig)) ??
          //   function InDev() {
          //     return null;
          //   },
          // ...columnConfig,
          // editable:
          //   tableSettings.readOnly && !userRoles.includes("ADMIN")
          //     ? false
          //     : columnConfig.editable ?? true,
          // width: columnConfig.width ?? DEFAULT_COL_WIDTH,
        })
      );

    // if (canAddColumn || !tableSettings.readOnly) {
    //   _columns.push({
    //     isNew: true,
    //     key: "new",
    //     fieldName: "_rowy_new",
    //     name: "Add column",
    //     type: FieldType.last,
    //     index: _columns.length ?? 0,
    //     width: 154,
    //     headerRenderer: FinalColumnHeader,
    //     headerCellClass: "final-column-header",
    //     cellClass: "final-column-cell",
    //     formatter: FinalColumn,
    //     editable: false,
    //   });
    // }

    return _columns;
  }, [
    tableColumnsOrdered,
    // userDocHiddenFields,
    // tableSettings.readOnly,
    // canAddColumn,
  ]);

  const table = useReactTable({
    data: tableRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    columnResizeMode: "onChange",
    // debugRows: true,
  });
  console.log(table, selectedCell);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(
      "keydown",
      // e.target,
      e.key,
      e.ctrlKey ? "ctrl" : "",
      e.altKey ? "alt" : "",
      e.metaKey ? "meta" : "",
      e.shiftKey ? "shift" : ""
    );
    const LISTENED_KEYS = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Enter",
      "Escape",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ];
    if (LISTENED_KEYS.includes(e.key)) e.preventDefault();

    const target = e.target as HTMLDivElement;
    if (
      target.getAttribute("role") !== "columnheader" &&
      target.getAttribute("role") !== "gridcell"
    )
      return;

    const colIndex = Number(target.getAttribute("aria-colindex")) - 1;
    const rowIndex =
      Number(target.parentElement!.getAttribute("aria-rowindex")) - 2;

    const rowId = target.getAttribute("data-rowId")!;
    const colId = target.getAttribute("data-colId")!;

    const isHeader = rowId === "_rowy_header";

    let newColIndex = colIndex;
    let newRowIndex = rowIndex;

    // const newSelectedCell: SelectedCell = selectedCell
    //   ? { ...selectedCell }
    //   : { path: rowId, columnKey: colId };

    switch (e.key) {
      case "ArrowUp":
        if (rowIndex > -1) newRowIndex = rowIndex - 1;
        break;

      case "ArrowDown":
        if (rowIndex < tableRows.length - 1) newRowIndex = rowIndex + 1;
        break;

      case "ArrowLeft":
        if (colIndex > 0) newColIndex = colIndex - 1;
        break;

      case "ArrowRight":
        if (colIndex < columns.length - 1) newColIndex = colIndex + 1;
        break;

      case "PageUp":
        newRowIndex = Math.max(0, rowIndex - COLLECTION_PAGE_SIZE);
        break;

      case "PageDown":
        newRowIndex = Math.min(
          tableRows.length - 1,
          rowIndex + COLLECTION_PAGE_SIZE
        );
        break;

      case "Home":
        newColIndex = 0;
        if (e.ctrlKey || e.metaKey) newRowIndex = -1;
        break;

      case "End":
        newColIndex = columns.length - 1;
        if (e.ctrlKey || e.metaKey) newRowIndex = tableRows.length - 1;
        break;
    }

    const newSelectedCell = {
      path:
        newRowIndex > -1
          ? tableRows[newRowIndex]._rowy_ref.path
          : "_rowy_header",
      columnKey: columns[newColIndex].id! || columns[0].id!,
    };
    console.log(newRowIndex, newColIndex, newSelectedCell);

    setSelectedCell(newSelectedCell);

    // Find matching DOM element for the cell
    const newCellEl = gridRef.current?.querySelector(
      `[aria-rowindex="${newRowIndex + 2}"] [aria-colindex="${
        newColIndex + 1
      }"]`
    );
    // Focus either the cell or the first focusable element in the cell
    if (newCellEl) (newCellEl as HTMLDivElement).focus();
  };

  return (
    <>
      <StyledTable
        ref={gridRef}
        role="grid"
        aria-readonly={tableSettings.readOnly}
        aria-colcount={columns.length}
        aria-rowcount={tableRows.length + 1}
        style={{ width: table.getTotalSize(), userSelect: "none" }}
        onKeyDown={handleKeyDown}
      >
        <div
          className="thead"
          role="rowgroup"
          style={{ position: "sticky", top: 0 }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <StyledRow key={headerGroup.id} role="row" aria-rowindex={1}>
              {headerGroup.headers.map((header) => {
                const isFocusable =
                  (!selectedCell && header.index === 0) ||
                  (selectedCell?.path === "_rowy_header" &&
                    selectedCell?.columnKey === header.id);

                return (
                  <ColumnHeaderComponent
                    key={header.id}
                    data-rowId={"_rowy_header"}
                    data-colId={header.id}
                    role="columnheader"
                    tabIndex={isFocusable ? 0 : -1}
                    aria-colindex={header.index + 1}
                    aria-readonly={canEditColumn}
                    // TODO: aria-sort={"none" | "ascending" | "descending" | "other" | undefined}
                    aria-selected={isFocusable}
                    label={header.column.columnDef.meta?.name || header.id}
                    type={header.column.columnDef.meta?.type}
                    style={{ width: header.getSize() }}
                    onClick={(e) => {
                      setSelectedCell({
                        path: "_rowy_header",
                        columnKey: header.id,
                      });
                      (e.target as HTMLDivElement).focus();
                    }}
                  >
                    {/* <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? "isResizing" : ""
                      }`,
                      // style: {
                      //   transform:
                      //     columnResizeMode === 'onEnd' &&
                      //     header.column.getIsResizing()
                      //       ? `translateX(${
                      //           table.getState().columnSizingInfo.deltaOffset
                      //         }px)`
                      //       : '',
                      // },
                    }}
                  /> */}
                  </ColumnHeaderComponent>
                );
              })}
            </StyledRow>
          ))}
        </div>

        <div className="tbody" role="rowgroup">
          {table.getRowModel().rows.map((row) => (
            <StyledRow key={row.id} role="row" aria-rowindex={row.index + 2}>
              {row.getVisibleCells().map((cell, cellIndex) => {
                const isFocusable =
                  selectedCell?.path === row.original._rowy_ref.path &&
                  selectedCell?.columnKey === cell.column.id;

                return (
                  <StyledCell
                    key={cell.id}
                    data-rowId={row.id}
                    data-colId={cell.column.id}
                    role="gridcell"
                    tabIndex={isFocusable ? 0 : -1}
                    aria-colindex={cellIndex + 1}
                    aria-readonly={
                      cell.column.columnDef.meta?.editable === false
                    }
                    aria-selected={isFocusable}
                    style={{ width: cell.column.getSize() }}
                    onClick={(e) => {
                      setSelectedCell({
                        path: row.original._rowy_ref.path,
                        columnKey: cell.column.id,
                      });
                      (e.target as HTMLDivElement).focus();
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    <button tabIndex={isFocusable && focusInsideCell ? 0 : -1}>
                      {isFocusable ? "f" : "x"}
                    </button>
                  </StyledCell>
                );
              })}
            </StyledRow>
          ))}
        </div>
      </StyledTable>
    </>
  );
}
