import { useMemo, useRef, useState, useEffect, useCallback } from "react";
// import useStateRef from "react-usestateref"; // testing with useStateWithRef
import { useAtom, useSetAtom } from "jotai";
import { useThrottledCallback } from "use-debounce";
import {
  RowSelectionState,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnPinningState,
  VisibilityState,
} from "@tanstack/react-table";
import { DropResult } from "react-beautiful-dnd";
import {
  get,
  includes,
  isArray,
  isNumber,
  cloneDeep,
  isEmpty,
} from "lodash-es";

import StyledTable from "./Styled/StyledTable";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import FinalColumn from "./FinalColumn/FinalColumn";
import ContextMenu from "./ContextMenu";
import EmptyState from "@src/components/EmptyState";
// import BulkActions from "./BulkActions";

import {
  tableScope,
  tableSchemaAtom,
  reactTableAtom,
  tableColumnsOrderedAtom,
  tableRowsAtom,
  tableNextPageAtom,
  tablePageAtom,
  updateColumnAtom,
  selectedCellAtom,
  tableSortsAtom,
  tableIdAtom,
  serverDocCountAtom,
  endCellAtom,
  selectedCellsAtom,
  bulkUpdateRowsAtom,
  tableSettingsAtom,
  SelectedCells,
} from "@src/atoms/tableScope";
import { projectScope, userSettingsAtom } from "@src/atoms/projectScope";
import { getFieldType, getFieldProp } from "@src/components/fields";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useMenuAction } from "./useMenuAction";
import { useSaveColumnSizing } from "./useSaveColumnSizing";
import useHotKeys from "./useHotKey";
import type { TableRow, ColumnConfig } from "@src/types/table";
import useStateWithRef from "./useStateWithRef"; // testing with useStateWithRef
import { Checkbox, FormControlLabel } from "@mui/material";
import SnackbarProgress, {
  ISnackbarProgressRef,
} from "@src/components/SnackbarProgress";
import { useSnackbar } from "notistack";

export const DEFAULT_ROW_HEIGHT = 41;
export const DEFAULT_COL_WIDTH = 150;
export const MIN_COL_WIDTH = 80;
export const TABLE_PADDING = 16;
export const OUT_OF_ORDER_MARGIN = 8;
export const DEBOUNCE_DELAY = 500;

declare module "@tanstack/table-core" {
  /** The `column.meta` property contains the column config from tableSchema */
  interface ColumnMeta<TData, TValue> extends ColumnConfig {}
}

const columnHelper = createColumnHelper<TableRow>();
const getRowId = (row: TableRow) => row._rowy_ref.path || row._rowy_ref.id;

export interface ITableProps {
  /** Determines if “Add column” button is displayed */
  canAddColumns: boolean;
  /** Determines if columns can be rearranged */
  canEditColumns: boolean;
  /**
   * Determines if any cell can be edited.
   * If false, `Table` only ever renders `EditorCell`.
   */
  canEditCells: boolean;
  /** The hidden columns saved to user settings */
  hiddenColumns?: string[];
  /**
   * Displayed when `tableRows` is empty.
   * Loading state handled by Suspense in parent component.
   */
  emptyState?: React.ReactNode;
  /**
   * If defined, it will show a checkbox to select rows. The
   * state is to be maintained by the parent component.
   *
   * Usage:
   *
   * const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});
   * const selectedRowsProp = useMemo(() => ({state: selectedRows, setState: setSelectedRows}), [selectedRows, setSelectedRows])
   * <Table selectedRows={selectedRowsProp} />
   */
  selectedRows?: {
    state: RowSelectionState;
    setState: React.Dispatch<React.SetStateAction<{}>>;
  };
}

/**
 * Takes table schema and row data from `tableScope` and makes it compatible
 * with TanStack Table. Renders table children and cell context menu.
 *
 * - Calls `useKeyboardNavigation` hook
 * - Handles rearranging columns
 * - Handles infinite scrolling
 * - Stores local state for resizing columns, and asks admins if they want to
 *   save to table schema for all users
 */
export default function Table({
  canAddColumns,
  canEditColumns,
  canEditCells,
  hiddenColumns,
  emptyState,
  selectedRows,
}: ITableProps) {
  const [tableSettings] = useAtom(tableSettingsAtom, tableScope);
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [serverDocCount] = useAtom(serverDocCountAtom, tableScope);
  const [tableColumnsOrdered] = useAtom(tableColumnsOrderedAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);
  const [tablePage, setTablePage] = useAtom(tablePageAtom, tableScope);
  const setReactTable = useSetAtom(reactTableAtom, tableScope);

  const updateColumn = useSetAtom(updateColumnAtom, tableScope);
  const bulkUpdateRows = useSetAtom(bulkUpdateRowsAtom, tableScope);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const snackbarProgressRef = useRef<ISnackbarProgressRef>();

  // Get user settings and tableId for applying sort sorting
  const [userSettings] = useAtom(userSettingsAtom, projectScope);
  const [tableId] = useAtom(tableIdAtom, tableScope);
  const setTableSorts = useSetAtom(tableSortsAtom, tableScope);
  const [selectedCells, setSelectedCells] = useAtom(
    selectedCellsAtom,
    tableScope
  ); // State to track selected cells
  // const [cellsThatNeedSelectedValues, setCellsThatNeedSelectedValues] = useAtom(cellsThatNeedCopyAtom);
  const [, setEndCellId] = useAtom(endCellAtom, tableScope);

  // Store a **state** and reference to the container element
  // so the state can re-render `TableBody`, preventing virtualization
  // not detecting scroll if the container element was initially `null`
  const [containerEl, setContainerEl, containerRef] =
    // useStateRef<HTMLDivElement | null>(null); // <-- older approach with useStateRef
    useStateWithRef<HTMLDivElement | null>(null); // <-- newer approach with custom hook

  const gridRef = useRef<HTMLDivElement>(null);

  // Get column defs from table schema
  // Also add end column for admins (canAddColumns || canEditCells)
  const columns = useMemo(() => {
    const _columns = tableColumnsOrdered
      // Hide column for all users using table schema
      .filter((column) => !column.hidden)
      .map((columnConfig) =>
        columnHelper.accessor((row) => get(row, columnConfig.fieldName), {
          id: columnConfig.fieldName,
          meta: columnConfig,
          size: columnConfig.width,
          enableResizing: columnConfig.resizable !== false,
          minSize: MIN_COL_WIDTH,
          cell: getFieldProp("TableCell", getFieldType(columnConfig)),
        })
      );

    if (canAddColumns || canEditCells) {
      _columns.push(
        columnHelper.display({
          id: "_rowy_column_actions",
          cell: FinalColumn as any,
        })
      );
    }

    return _columns;
  }, [tableColumnsOrdered, canAddColumns, canEditCells, selectedRows]);

  columns.unshift(
    ...useMemo(() => {
      if (!selectedRows) return [];

      return [
        columnHelper.display({
          id: "_rowy_select",
          size: 41.8, // TODO: We shouldn't have to change this often
          header: ({ table }) => {
            const checked =
              Object.keys(selectedRows.state).length >= serverDocCount!;
            const indeterminate = Object.keys(selectedRows.state).length > 0;
            return (
              <FormControlLabel
                sx={{ margin: 0 }}
                label=""
                control={
                  <Checkbox
                    checked={checked}
                    indeterminate={indeterminate && !checked}
                    onChange={() => {
                      table.toggleAllRowsSelected(
                        !table.getIsAllRowsSelected()
                      );
                    }}
                  />
                }
              />
            );
          },
          cell: ({ row }) => {
            return (
              <FormControlLabel
                label=""
                sx={{ margin: 0 }}
                control={
                  <Checkbox
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                }
              />
            );
          },
        }),
      ];
    }, [selectedRows])
  );

  // Get user’s hidden columns from props and memoize into a `VisibilityState`
  const columnVisibility: VisibilityState = useMemo(() => {
    if (!Array.isArray(hiddenColumns)) return {};
    return hiddenColumns.reduce((a, c) => ({ ...a, [c]: false }), {});
  }, [hiddenColumns]);

  const columnPinning: ColumnPinningState = useMemo(
    () => ({
      left: [
        ...(selectedRows ? ["_rowy_select"] : []),
        ...columns
          .filter(
            (c) => c.meta?.fixed && c.id && columnVisibility[c.id] !== false
          )
          .map((c) => c.id!),
      ],
    }),
    [columns, columnVisibility]
  );
  const lastFrozen: string | undefined =
    columnPinning.left![columnPinning.left!.length - 1];

  // Call TanStack Table
  const table = useReactTable({
    data: tableRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
    columnResizeMode: "onChange",
    ...(selectedRows && {
      enableRowSelection: true,
      enableMultiRowSelection: true,
      state: {
        rowSelection: selectedRows.state,
      },
      onRowSelectionChange: selectedRows.setState,
    }),
  });

  // Store local `columnSizing` state so we can save it to table schema
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
  // Update the reactTable atom when table state changes.
  useMemo(() => {
    setReactTable(table);
  }, [table, setReactTable]);
  // Get rows and columns for virtualization
  const { rows } = table.getRowModel();
  const leafColumns = table.getVisibleLeafColumns();

  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    gridRef,
    tableRows,
    leafColumns,
  });
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const { handleCopy, handlePaste, handleCut } = useMenuAction(selectedCell);
  const { handler: hotKeysHandler } = useHotKeys([
    ["mod+C", handleCopy],
    ["mod+X", handleCut],
    ["mod+V", (e) => handlePaste], // So the event isn't passed to the handler
  ]);
  const handleShiftArrowKey = useCallback(
    (direction: "ArrowLeft" | "ArrowRight" | "ArrowDown" | "ArrowUp") => {
      const selectedCell = selectedCells;
      if (!selectedCell || !table) return;

      const visibleCells = selectedCell.cell.getContext().row.getVisibleCells();
      const cellIndex = visibleCells.findIndex(
        (cell) => cell.id === selectedCell.cell.id
      );
      const rowIndex = selectedCell.rowIndex;
      const rows = table.getRowModel().rows || [];

      if (!direction || !selectedCells) {
        return;
      }

      setSelectedCells((prev) => {
        if (prev) {
          switch (direction) {
            case "ArrowLeft":
              return cellIndex === prev.right && prev.left > 0
                ? { ...prev, left: prev.left - 1 }
                : prev.right > cellIndex && prev.right < visibleCells.length
                ? { ...prev, right: prev.right - 1 }
                : prev;
            case "ArrowRight":
              return cellIndex === prev.left &&
                prev.right < visibleCells.length - 1
                ? { ...prev, right: prev.right + 1 }
                : prev.left < cellIndex && prev.left >= 0
                ? { ...prev, left: prev.left + 1 }
                : prev;
            case "ArrowUp":
              return rowIndex === prev.down && prev.up > 0
                ? { ...prev, up: prev.up - 1 }
                : prev.down > rowIndex && prev.down < rows.length
                ? { ...prev, down: prev.down - 1 }
                : prev;
            case "ArrowDown":
              return rowIndex === prev.up && prev.down < rows.length - 1
                ? { ...prev, down: prev.down + 1 }
                : prev.up < rowIndex && prev.up >= 0
                ? { ...prev, up: prev.up + 1 }
                : prev;
            default:
              return prev;
          }
        }
        return prev;
      });
    },
    [selectedCells, setSelectedCells, table]
  );

  enum CopyDirection {
    Vertical,
    Horizontal,
  }

  function getCopyDirection(
    selectedCells: SelectedCells,
    endY: number,
    endX: number
  ): CopyDirection {
    const di = Math.min(
      Math.abs(endY - selectedCells.down),
      Math.abs(endY - selectedCells.up)
    );
    const dj = Math.min(
      Math.abs(endX - selectedCells.right),
      Math.abs(endX - selectedCells.left)
    );
    return di >= dj ? CopyDirection.Vertical : CopyDirection.Horizontal;
  }

  function copyCells(
    copyDirection: CopyDirection,
    selectedCells: SelectedCells,
    endY: number,
    endX: number
  ) {
    const updateData = cloneDeep(tableRows);
    let { left, right, up, down } = selectedCells;
    let newUpdates = [];
    if (copyDirection === CopyDirection.Vertical) {
      let startIndex = endY > down ? up : down;
      for (
        let i = endY > down ? down + 1 : up - 1;
        endY > down ? i <= endY && i < tableRows.length : i >= endY;
        endY > down ? i++ : i--
      ) {
        let row = rows[i];
        let cells = row?._getAllVisibleCells() || [];
        const newUpdate: Partial<TableRow> = {};
        for (
          let j = endY > down ? left : right;
          endY > down ? j <= right && j < cells.length : j >= left;
          endY > down ? j++ : j--
        ) {
          let cell = cells[j];
          let selectedRow = updateData[startIndex];
          let row = updateData[i];
          if (cell && row && selectedRow) {
            let key = cell.column.id;
            newUpdate[key] = get(selectedRow, key, "");
          }
        }
        if (!isEmpty(newUpdate))
          newUpdates.push({
            row: updateData[i],
            path: updateData[i]._rowy_ref.path,
            newUpdate,
            deleteField: false,
            arrayTableData: updateData[i]._rowy_ref.arrayTableData,
          });
        if (endY > down) {
          startIndex = startIndex === down ? up - 1 : startIndex;
          startIndex++;
        } else {
          startIndex = startIndex === up ? down + 1 : startIndex;
          startIndex--;
        }
      }
      up = Math.min(up, endY);
      down = Math.max(down, endY);
    } else if (copyDirection === CopyDirection.Horizontal) {
      //ideally this should be allowed.
      let startIndex = left;
      for (let i = down; i >= up; i--) {
        let cells = rows[i]?._getAllVisibleCells() || [];
        startIndex = endX > right ? left : right;
        const newUpdate: Partial<TableRow> = {};
        for (
          let j = endX > right ? right + 1 : left - 1;
          endX > right ? j <= endX : j >= endX;
          endX > right ? j++ : j--
        ) {
          let copyCell = cells[startIndex];
          let cell = cells[j];
          let selectedRow = updateData[i];
          let row = updateData[i];
          if (cell && row && selectedRow && copyCell) {
            let key = cell.column.id;
            let copyKey = copyCell.column.id;
            newUpdate[key] = get(selectedRow, copyKey, "");
          }
          if (!isEmpty(newUpdate))
            newUpdates.push({
              row: updateData[i],
              path: updateData[i]._rowy_ref.path,
              newUpdate,
              deleteField: false,
              arrayTableData: updateData[i]._rowy_ref.arrayTableData,
            });
          if (endX > right) {
            startIndex = startIndex === right ? left - 1 : startIndex;
            startIndex++;
          } else {
            startIndex = startIndex === left ? right + 1 : startIndex;
            startIndex--;
          }
        }
      }
      left = Math.min(left, endX);
      right = Math.max(right, endX);
    }
    setSelectedCells((prev) => {
      if (prev) {
        return {
          ...prev,
          up,
          down,
          left,
          right,
        };
      }
      return prev;
    });
    return newUpdates;
  }

  async function handleCopying(endCellId: string | null) {
    if (!selectedCells || !endCellId) {
      return;
    }
    const rows = table.getRowModel().rows;
    if (endCellId && rows) {
      const cellMeta = endCellId.split("__");
      const cellId = cellMeta[1];
      const endY = parseInt(cellMeta[0] ?? "");

      if (isNumber(endY)) {
        const row = rows[endY];
        const endX = row
          ?._getAllVisibleCells()
          .findIndex((cell) => cell.id === cellId);
        if (isNumber(endX)) {
          const copyDirection = getCopyDirection(selectedCells, endY, endX);
          const { up, down, left, right } = selectedCells;
          const loadingSnackbar = enqueueSnackbar(
            `Copying values. This might take a while.`,
            {
              persist: true,
              action: (
                <SnackbarProgress
                  stateRef={snackbarProgressRef}
                  target={
                    copyDirection === CopyDirection.Vertical
                      ? Math.max(endY - down, up - endY) * (right - left + 1)
                      : (down - up + 1) * Math.max(endX - right, left - endX) ||
                        0
                  }
                  label=" cells"
                />
              ),
            }
          );
          let newUpdates = copyCells(copyDirection, selectedCells, endY, endX);
          setEndCellId(null);
          await bulkUpdateRows({
            updates: newUpdates,
            collection: tableSettings.collection,
          });
          closeSnackbar(loadingSnackbar);
        }
      }
    }
  }

  useKeyPress(
    ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"],
    handleShiftArrowKey
  );
  const { startDrag, isDragging } = useDrag(handleCopying);

  // Handle prompt to save local column sizes if user `canEditColumns`
  useSaveColumnSizing(columnSizing, canEditColumns);

  const handleDropColumn = useCallback(
    (result: DropResult) => {
      if (result.destination?.index === undefined || !result.draggableId)
        return;

      updateColumn({
        key: result.draggableId,
        index: selectedRows
          ? result.destination.index - 1
          : result.destination.index,
        config: {},
      });
    },
    [updateColumn, selectedRows]
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
  }, [fetchMoreOnBottomReached, tableNextPage.loading, containerRef]);

  useEffect(() => {
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [handlePaste]);

  // apply user default sort on first render
  const [applySort, setApplySort] = useState(true);
  useEffect(() => {
    if (applySort && Object.keys(tableSchema).length) {
      const userDefaultSort = userSettings.tables?.[tableId]?.sorts || [];
      setTableSorts(
        userDefaultSort.length ? userDefaultSort : tableSchema.sorts || []
      );
      setApplySort(false);
    }
  }, [tableSchema, userSettings, tableId, setTableSorts, applySort]);

  return (
    <div
      ref={(el) => {
        if (!el) return;
        setContainerEl(el);
      }}
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
      style={{ overflow: "auto", width: "100%", height: "100%" }}
    >
      <StyledTable
        ref={gridRef}
        role="grid"
        aria-readonly={!canEditCells}
        aria-colcount={columns.length}
        aria-rowcount={tableRows.length + 1}
        style={
          {
            width: table.getTotalSize(),
            userSelect: "none",
            "--row-height": `${tableSchema.rowHeight || DEFAULT_ROW_HEIGHT}px`,
          } as any
        }
        onKeyDown={(e) => {
          handleKeyDown(e);
          hotKeysHandler(e);
        }}
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
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            handleDropColumn={handleDropColumn}
            canAddColumns={canAddColumns}
            canEditColumns={canEditColumns}
            lastFrozen={lastFrozen}
            columnSizing={columnSizing}
          />
        </div>

        {tableRows.length === 0 ? (
          emptyState ?? <EmptyState sx={{ py: 8 }} />
        ) : (
          <TableBody
            containerEl={containerEl}
            containerRef={containerRef}
            leafColumns={leafColumns}
            rows={rows}
            canEditCells={canEditCells}
            lastFrozen={lastFrozen}
            columnSizing={columnSizing}
            tableInstance={table}
            startDrag={startDrag}
            isDragging={isDragging}
          />
        )}
      </StyledTable>

      <div
        id="rowy-table-editable-cell-description"
        style={{ display: "none" }}
      >
        Press Enter to edit.
      </div>

      <ContextMenu />
    </div>
  );
}

export function useKeyPress(
  targetKey: string[] | string,
  handleShiftArrowKey: Function
) {
  const [keyPressed, setKeyPressed] = useState(false);

  targetKey = isArray(targetKey) ? targetKey : [targetKey];

  useEffect(() => {
    const downHandler = ({ key, shiftKey }: KeyboardEvent) => {
      if (includes(targetKey, key) && shiftKey) {
        setKeyPressed(true);
        handleShiftArrowKey(key);
      }
    };

    const upHandler = ({ key }: KeyboardEvent) => {
      if (includes(targetKey, key)) setKeyPressed(false);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

export function useDrag(handleCopying: Function) {
  const [isDragging, setIsDragging] = useState(false);
  const [endCellId] = useAtom(endCellAtom, tableScope);

  useEffect(() => {
    if (!isDragging) {
      return;
    }
    function handleMouseUp(e: MouseEvent) {
      e.preventDefault();
      if (isDragging) {
        setIsDragging(false);
        handleCopying(endCellId);
      }
    }
    // document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, endCellId]);

  function startDrag(e: MouseEvent, id: string) {
    e.preventDefault();
    setIsDragging(true);
  }

  return { startDrag, isDragging };
}
