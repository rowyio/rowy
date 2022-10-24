import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  useDebounce,
  useDebouncedCallback,
  useThrottledCallback,
} from "use-debounce";
import { useSnackbar } from "notistack";
import useMemoValue from "use-memo-value";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { isEmpty, isEqual } from "lodash-es";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtual } from "react-virtual";

import { TOP_BAR_HEIGHT } from "@src/layouts/Navigation/TopBar";
import { TABLE_TOOLBAR_HEIGHT } from "@src/components/TableToolbar";
import { StyledTable } from "./Styled/StyledTable";
import { StyledRow } from "./Styled/StyledRow";
import { StyledResizer } from "./Styled/StyledResizer";
import ColumnHeaderComponent from "./Column";

import { IconButton, LinearProgress, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

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
import { useKeyboardNavigation } from "./useKeyboardNavigation";

export const DEFAULT_ROW_HEIGHT = 41;
export const DEFAULT_COL_WIDTH = 150;
export const MIN_COL_WIDTH = 32;
export const TABLE_PADDING = 16;
export const TABLE_GUTTER = 8;
export const DEBOUNCE_DELAY = 500;

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData, TValue> extends ColumnConfig {}
}

const columnHelper = createColumnHelper<TableRow>();
const getRowId = (row: TableRow) => row._rowy_ref.path || row._rowy_ref.id;

export default function TableComponent() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [userRoles] = useAtom(userRolesAtom, projectScope);
  const [userSettings] = useAtom(userSettingsAtom, projectScope);

  const [tableId] = useAtom(tableIdAtom, tableScope);
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const [tablePage, setTablePage] = useAtom(tablePageAtom, tableScope);
  const [selectedCell, setSelectedCell] = useAtom(selectedCellAtom, tableScope);

  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const canAddColumn = userRoles.includes("ADMIN");
  const canEditColumn = userRoles.includes("ADMIN");

  // Get column defs from table schema
  // Also add end column for admins
  const columns = useMemo(() => {
    const _columns = tableColumnsOrdered
      // Hide column for all users using table schema
      .filter((column) => !column.hidden)
      .map((columnConfig) =>
        columnHelper.accessor(columnConfig.fieldName, {
          id: columnConfig.fieldName,
          meta: columnConfig,
          size: columnConfig.width,
          enableResizing: columnConfig.resizable !== false,
          minSize: MIN_COL_WIDTH,
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

    if (canAddColumn || !tableSettings.readOnly) {
      _columns.push(
        columnHelper.display({
          id: "_rowy_column_actions",
          header: () => "Actions",
          cell: () => (
            <>
              <IconButton>M</IconButton>
              <IconButton>D</IconButton>
              <IconButton>X</IconButton>
            </>
          ),
        })
      );
    }

    return _columns;
  }, [tableColumnsOrdered, canAddColumn, tableSettings.readOnly]);

  // Get user’s hidden columns from user document
  const userDocHiddenFields =
    userSettings.tables?.[formatSubTableName(tableId)]?.hiddenFields;
  // Memoize into a VisibilityState
  const columnVisibility = useMemo(() => {
    if (!Array.isArray(userDocHiddenFields)) return {};
    return userDocHiddenFields.reduce((a, c) => ({ ...a, [c]: false }), {});
  }, [userDocHiddenFields]);

  // Get frozen columns
  const columnPinning = useMemo(
    () => ({
      left: columns.filter((c) => c.meta?.fixed && c.id).map((c) => c.id!),
    }),
    [columns]
  );
  const lastFrozen: string | undefined =
    columnPinning.left[columnPinning.left.length - 1];

  // Call TanStack Table
  const table = useReactTable({
    data: tableRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    columnResizeMode: "onChange",
  });

  const [columnSizing, setColumnSizing] = useState(
    table.initialState.columnSizing
  );
  table.setOptions((prev) => ({
    ...prev,
    state: { ...prev.state, columnVisibility, columnPinning, columnSizing },
    onColumnSizingChange: setColumnSizing,
  }));

  // Debounce for saving to schema
  const [debouncedColumnSizing] = useDebounce(columnSizing, DEBOUNCE_DELAY, {
    equalityFn: isEqual,
  });
  // Offer to save when column sizing changes
  useEffect(() => {
    if (!canEditColumn || isEmpty(debouncedColumnSizing)) return;

    const snackbarId = enqueueSnackbar("Save column sizes for all users?", {
      action: (
        <LoadingButton
          variant="contained"
          color="primary"
          onClick={handleSaveToSchema}
        >
          Save
        </LoadingButton>
      ),
      anchorOrigin: { horizontal: "center", vertical: "top" },
    });

    async function handleSaveToSchema() {
      const promises = Object.entries(debouncedColumnSizing).map(
        ([key, value]) => updateColumn({ key, config: { width: value } })
      );
      await Promise.all(promises);
      closeSnackbar(snackbarId);
    }

    return () => closeSnackbar(snackbarId);
  }, [
    debouncedColumnSizing,
    canEditColumn,
    enqueueSnackbar,
    closeSnackbar,
    updateColumn,
  ]);

  const { rows } = table.getRowModel();
  const leafColumns = table.getVisibleLeafColumns();
  // console.log(table, selectedCell);

  const {
    virtualItems: virtualRows,
    totalSize: totalHeight,
    scrollToIndex: scrollToRowIndex,
  } = useVirtual({
    parentRef: containerRef,
    size: tableRows.length,
    overscan: 10,
    paddingEnd: TABLE_PADDING,
    estimateSize: useCallback(
      () => tableSchema.rowHeight || DEFAULT_ROW_HEIGHT,
      [tableSchema.rowHeight]
    ),
  });

  const {
    virtualItems: virtualCols,
    totalSize: totalWidth,
    scrollToIndex: scrollToColIndex,
  } = useVirtual({
    parentRef: containerRef,
    horizontal: true,
    size: leafColumns.length,
    overscan: 10,
    paddingStart: TABLE_PADDING,
    paddingEnd: TABLE_PADDING,
    estimateSize: useCallback(
      (index: number) => leafColumns[index].columnDef.size || DEFAULT_COL_WIDTH,
      [leafColumns]
    ),
  });

  useEffect(() => {
    if (!selectedCell) return;
    if (selectedCell.path) {
      const rowIndex = tableRows.findIndex(
        (row) => row._rowy_ref.path === selectedCell.path
      );
      if (rowIndex > -1) scrollToRowIndex(rowIndex);
    }
    if (selectedCell.columnKey) {
      const colIndex = leafColumns.findIndex(
        (col) => col.id === selectedCell.columnKey
      );
      if (colIndex > -1) scrollToColIndex(colIndex);
    }
  }, [
    selectedCell,
    tableRows,
    leafColumns,
    scrollToRowIndex,
    scrollToColIndex,
  ]);

  const { handleKeyDown, focusInsideCell } = useKeyboardNavigation({
    gridRef,
    tableRows,
    leafColumns,
  });

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  const paddingLeft = virtualCols.length > 0 ? virtualCols?.[0]?.start || 0 : 0;
  const paddingRight =
    virtualCols.length > 0
      ? totalWidth - (virtualCols?.[virtualCols.length - 1]?.end || 0)
      : 0;

  const fetchMoreOnBottomReached = useThrottledCallback(
    (containerElement?: HTMLDivElement | null) => {
      if (!containerElement) return;

      const { scrollHeight, scrollTop, clientHeight } = containerElement;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        setTablePage((p) => p + 1);
      }
    },
    DEBOUNCE_DELAY
  );
  // Check on mount and after fetch to see if the table is at the bottom
  // for large screen heights
  useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current);
  }, [fetchMoreOnBottomReached, tablePage, tableNextPage.loading]);

  return (
    <div
      ref={containerRef}
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      style={{ overflow: "auto", width: "100%", height: "100%" }}
    >
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
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: `0 ${TABLE_PADDING}px`,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <StyledRow key={headerGroup.id} role="row" aria-rowindex={1}>
              {headerGroup.headers.map((header) => {
                const isSelectedCell =
                  (!selectedCell && header.index === 0) ||
                  (selectedCell?.path === "_rowy_header" &&
                    selectedCell?.columnKey === header.id);

                return (
                  <ColumnHeaderComponent
                    key={header.id}
                    data-row-id={"_rowy_header"}
                    data-col-id={header.id}
                    data-frozen={header.column.getIsPinned() || undefined}
                    data-frozen-last={lastFrozen === header.id || undefined}
                    role="columnheader"
                    tabIndex={isSelectedCell ? 0 : -1}
                    aria-colindex={header.index + 1}
                    aria-readonly={!canEditColumn}
                    // TODO: aria-sort={"none" | "ascending" | "descending" | "other" | undefined}
                    aria-selected={isSelectedCell}
                    label={header.column.columnDef.meta?.name || header.id}
                    type={header.column.columnDef.meta?.type}
                    style={{
                      width: header.getSize(),
                      left: header.column.getIsPinned()
                        ? virtualCols[header.index].start - TABLE_PADDING
                        : undefined,
                    }}
                    sx={{ "& + &": { borderLeft: "none" } }}
                    onClick={(e) => {
                      setSelectedCell({
                        path: "_rowy_header",
                        columnKey: header.id,
                      });
                      (e.target as HTMLDivElement).focus();
                    }}
                  >
                    {header.column.getCanResize() && (
                      <StyledResizer
                        isResizing={header.column.getIsResizing()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      />
                    )}
                  </ColumnHeaderComponent>
                );
              })}
            </StyledRow>
          ))}
        </div>

        <div className="tbody" role="rowgroup">
          {paddingTop > 0 && (
            <div role="presentation" style={{ height: `${paddingTop}px` }} />
          )}

          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];

            return (
              <StyledRow
                key={row.id}
                role="row"
                aria-rowindex={row.index + 2}
                style={{ height: tableSchema.rowHeight }}
              >
                {paddingLeft > 0 && (
                  <div
                    role="presentation"
                    style={{ width: `${paddingLeft}px` }}
                  />
                )}

                {virtualCols.map((virtualCell) => {
                  const cellIndex = virtualCell.index;
                  const cell = row.getVisibleCells()[cellIndex];

                  const isSelectedCell =
                    selectedCell?.path === row.original._rowy_ref.path &&
                    selectedCell?.columnKey === cell.column.id;

                  return (
                    <StyledCell
                      key={cell.id}
                      data-row-id={row.id}
                      data-col-id={cell.column.id}
                      data-frozen={cell.column.getIsPinned() || undefined}
                      data-frozen-last={
                        lastFrozen === cell.column.id || undefined
                      }
                      role="gridcell"
                      tabIndex={isSelectedCell && !focusInsideCell ? 0 : -1}
                      aria-colindex={cellIndex + 1}
                      aria-readonly={
                        cell.column.columnDef.meta?.editable === false
                      }
                      aria-selected={isSelectedCell}
                      style={{
                        width: cell.column.getSize(),
                        left: cell.column.getIsPinned()
                          ? virtualCell.start - TABLE_PADDING
                          : undefined,
                        backgroundColor:
                          cell.column.id === "_rowy_column_actions"
                            ? "transparent"
                            : undefined,
                        borderBottomWidth:
                          cell.column.id === "_rowy_column_actions"
                            ? 0
                            : undefined,
                        borderRightWidth:
                          cell.column.id === "_rowy_column_actions"
                            ? 0
                            : undefined,
                      }}
                      onClick={(e) => {
                        setSelectedCell({
                          path: row.original._rowy_ref.path,
                          columnKey: cell.column.id,
                        });
                        (e.target as HTMLDivElement).focus();
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {/* <button
                        tabIndex={isSelectedCell && focusInsideCell ? 0 : -1}
                      >
                        {isSelectedCell ? "f" : "x"}
                      </button> */}
                    </StyledCell>
                  );
                })}

                {paddingRight > 0 && (
                  <div
                    role="presentation"
                    style={{ width: `${paddingRight}px` }}
                  />
                )}
              </StyledRow>
            );
          })}

          {paddingBottom > 0 && (
            <div role="presentation" style={{ height: `${paddingBottom}px` }} />
          )}
        </div>
      </StyledTable>
    </div>
  );
}
