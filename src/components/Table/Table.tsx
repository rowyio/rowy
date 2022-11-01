import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useThrottledCallback } from "use-debounce";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { Portal } from "@mui/material";

import StyledTable from "./Styled/StyledTable";
import StyledRow from "./Styled/StyledRow";
import ColumnHeader from "./ColumnHeader";
import StyledResizer from "./Styled/StyledResizer";
import FinalColumnHeader from "./FinalColumn/FinalColumnHeader";
import FinalColumn from "./FinalColumn/FinalColumn";
import OutOfOrderIndicator from "./OutOfOrderIndicator";
import ContextMenu from "./ContextMenu";

import EmptyState from "@src/components/EmptyState";
// import BulkActions from "./BulkActions";

import {
  tableScope,
  tableSettingsAtom,
  tableSchemaAtom,
  tableColumnsOrderedAtom,
  tableRowsAtom,
  tableNextPageAtom,
  tablePageAtom,
  updateColumnAtom,
  updateFieldAtom,
  selectedCellAtom,
  contextMenuTargetAtom,
} from "@src/atoms/tableScope";
import { COLLECTION_PAGE_SIZE } from "@src/config/db";

import { getFieldType, getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { TableRow, ColumnConfig } from "@src/types/table";
import { StyledCell } from "./Styled/StyledCell";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useSaveColumnSizing } from "./useSaveColumnSizing";
import useVirtualization from "./useVirtualization";

export const DEFAULT_ROW_HEIGHT = 41;
export const DEFAULT_COL_WIDTH = 150;
export const MIN_COL_WIDTH = 80;
export const TABLE_PADDING = 16;
export const OUT_OF_ORDER_MARGIN = 8;
export const DEBOUNCE_DELAY = 500;

declare module "@tanstack/table-core" {
  interface ColumnMeta<TData, TValue> extends ColumnConfig {}
}

const columnHelper = createColumnHelper<TableRow>();
const getRowId = (row: TableRow) => row._rowy_ref.path || row._rowy_ref.id;

export interface ITableProps {
  canAddColumn: boolean;
  canEditColumn: boolean;
  canEditCell: boolean;
  hiddenColumns?: string[];
  emptyState?: React.ReactNode;
}

export default function Table({
  canAddColumn,
  canEditColumn,
  canEditCell,
  hiddenColumns,
  emptyState,
}: ITableProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const [tablePage, setTablePage] = useAtom(tablePageAtom, tableScope);
  const [selectedCell, setSelectedCell] = useAtom(selectedCellAtom, tableScope);
  const setContextMenuTarget = useSetAtom(contextMenuTargetAtom, tableScope);

  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
        })
      );

    if (canAddColumn || !tableSettings.readOnly) {
      _columns.push(
        columnHelper.display({
          id: "_rowy_column_actions",
          cell: FinalColumn as any,
        })
      );
    }

    return _columns;
  }, [tableColumnsOrdered, canAddColumn, tableSettings.readOnly]);

  // Get user’s hidden columns from props and memoize into a VisibilityState
  const columnVisibility = useMemo(() => {
    if (!Array.isArray(hiddenColumns)) return {};
    return hiddenColumns.reduce((a, c) => ({ ...a, [c]: false }), {});
  }, [hiddenColumns]);

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

  // Store local columnSizing state so we can save it to table schema
  // in `useSaveColumnSizing`. This could be generalized by storing the
  // entire table state.
  const [columnSizing, setColumnSizing] = useState(
    table.initialState.columnSizing
  );
  table.setOptions((prev) => ({
    ...prev,
    state: { ...prev.state, columnVisibility, columnPinning, columnSizing },
    onColumnSizingChange: setColumnSizing,
  }));

  const { rows } = table.getRowModel();
  const leafColumns = table.getVisibleLeafColumns();

  const { handleKeyDown, focusInsideCell } = useKeyboardNavigation({
    gridRef,
    tableRows,
    leafColumns,
  });
  const {
    virtualRows,
    virtualCols,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  } = useVirtualization(containerRef, leafColumns);
  useSaveColumnSizing(columnSizing, canEditColumn);

  const handleDropColumn = useCallback(
    (result: DropResult) => {
      if (result.destination?.index === undefined || !result.draggableId)
        return;

      console.log(result.draggableId, result.destination.index);

      updateColumn({
        key: result.draggableId,
        index: result.destination.index,
        config: {},
      });
    },
    [updateColumn]
  );

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
        style={
          {
            width: table.getTotalSize(),
            userSelect: "none",
            "--row-height": `${tableSchema.rowHeight || DEFAULT_ROW_HEIGHT}px`,
          } as any
        }
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
          <DragDropContext onDragEnd={handleDropColumn}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Droppable droppableId="droppable-column" direction="horizontal">
                {(provided) => (
                  <StyledRow
                    key={headerGroup.id}
                    role="row"
                    aria-rowindex={1}
                    style={{ height: DEFAULT_ROW_HEIGHT + 1 }}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {headerGroup.headers.map((header) => {
                      const isSelectedCell =
                        (!selectedCell && header.index === 0) ||
                        (selectedCell?.path === "_rowy_header" &&
                          selectedCell?.columnKey === header.id);

                      if (header.id === "_rowy_column_actions")
                        return (
                          <FinalColumnHeader
                            key={header.id}
                            data-row-id={"_rowy_header"}
                            data-col-id={header.id}
                            tabIndex={isSelectedCell ? 0 : -1}
                            focusInsideCell={isSelectedCell && focusInsideCell}
                            aria-colindex={header.index + 1}
                            aria-readonly={!canEditColumn}
                            aria-selected={isSelectedCell}
                          />
                        );

                      if (!header.column.columnDef.meta) return null;

                      return (
                        <Draggable
                          key={header.id}
                          draggableId={header.id}
                          index={header.index}
                          isDragDisabled={!canEditColumn}
                          disableInteractiveElementBlocking
                        >
                          {(provided, snapshot) => (
                            <ColumnHeader
                              key={header.id}
                              data-row-id={"_rowy_header"}
                              data-col-id={header.id}
                              data-frozen={
                                header.column.getIsPinned() || undefined
                              }
                              data-frozen-last={
                                lastFrozen === header.id || undefined
                              }
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              tabIndex={isSelectedCell ? 0 : -1}
                              aria-colindex={header.index + 1}
                              aria-readonly={!canEditColumn}
                              aria-selected={isSelectedCell}
                              column={header.column.columnDef.meta!}
                              style={{
                                width: header.getSize(),
                                left: header.column.getIsPinned()
                                  ? virtualCols[header.index].start -
                                    TABLE_PADDING
                                  : undefined,
                                ...provided.draggableProps.style,
                                zIndex: header.column.getIsPinned() ? 11 : 10,
                              }}
                              width={header.getSize()}
                              sx={[
                                snapshot.isDragging
                                  ? {}
                                  : { "& + &": { borderLeft: "none" } },
                              ]}
                              onClick={(e) => {
                                setSelectedCell({
                                  path: "_rowy_header",
                                  columnKey: header.id,
                                });
                                (e.target as HTMLDivElement).focus();
                              }}
                              focusInsideCell={
                                isSelectedCell && focusInsideCell
                              }
                            >
                              <div
                                {...provided.dragHandleProps}
                                tabIndex={
                                  isSelectedCell && focusInsideCell ? 0 : -1
                                }
                                aria-describedby={
                                  isSelectedCell && focusInsideCell
                                    ? provided.dragHandleProps?.[
                                        "aria-describedby"
                                      ]
                                    : undefined
                                }
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  zIndex: 0,
                                }}
                              />

                              {header.column.getCanResize() && (
                                <StyledResizer
                                  isResizing={header.column.getIsResizing()}
                                  onMouseDown={header.getResizeHandler()}
                                  onTouchStart={header.getResizeHandler()}
                                />
                              )}
                            </ColumnHeader>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </StyledRow>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>

        <div className="tbody" role="rowgroup">
          {paddingTop > 0 && (
            <div role="presentation" style={{ height: `${paddingTop}px` }} />
          )}

          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            const outOfOrder = row.original._rowy_outOfOrder;

            return (
              <StyledRow
                key={row.id}
                role="row"
                aria-rowindex={row.index + 2}
                style={{
                  height: "auto",
                  marginBottom: outOfOrder ? OUT_OF_ORDER_MARGIN : 0,
                }}
                data-out-of-order={outOfOrder || undefined}
              >
                {paddingLeft > 0 && (
                  <div
                    role="presentation"
                    style={{ width: `${paddingLeft}px` }}
                  />
                )}

                {outOfOrder && <OutOfOrderIndicator />}

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
                      aria-describedby="rowy-table-cell-description"
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
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setSelectedCell({
                          path: row.original._rowy_ref.path,
                          columnKey: cell.column.id,
                        });
                        (e.target as HTMLDivElement).focus();
                        setContextMenuTarget(e.target as HTMLElement);
                      }}
                    >
                      <div
                        className="cell-contents"
                        style={{ height: tableSchema.rowHeight }}
                      >
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          focusInsideCell: isSelectedCell && focusInsideCell,
                        })}
                      </div>
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

          {tableRows.length === 0 &&
            (emptyState ?? <EmptyState sx={{ py: 8 }} />)}
        </div>
      </StyledTable>

      <Portal>
        <div id="rowy-table-cell-description" style={{ display: "none" }}>
          Press Enter to edit.
        </div>
      </Portal>

      <ContextMenu />
    </div>
  );
}
