import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { useVirtual, defaultRangeExtractor } from "react-virtual";
import type { Range } from "react-virtual";

import {
  tableScope,
  tableSchemaAtom,
  tableRowsAtom,
  selectedCellAtom,
} from "@src/atoms/tableScope";
import {
  TABLE_PADDING,
  DEFAULT_ROW_HEIGHT,
  OUT_OF_ORDER_MARGIN,
  DEFAULT_COL_WIDTH,
} from "./Table";
import type { TableRow } from "@src/types/table";
import type { Column, ColumnSizingState } from "@tanstack/react-table";

import { MIN_COL_WIDTH } from "./Table";

/**
 * Virtualizes rows and columns,
 * and scrolls to selected cell
 */
export function useVirtualization(
  containerRef: React.RefObject<HTMLDivElement>,
  leafColumns: Column<TableRow, unknown>[],
  columnSizing: ColumnSizingState
) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [tableRows] = useAtom(tableRowsAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);

  // Virtualize rows
  const {
    virtualItems: virtualRows,
    totalSize: totalHeight,
    scrollToIndex: scrollToRowIndex,
  } = useVirtual({
    parentRef: containerRef,
    size: tableRows.length,
    overscan: 5,
    paddingEnd: TABLE_PADDING,
    estimateSize: useCallback(
      (index: number) =>
        (tableSchema.rowHeight || DEFAULT_ROW_HEIGHT) +
        (tableRows[index]._rowy_outOfOrder ? OUT_OF_ORDER_MARGIN : 0),
      [tableSchema.rowHeight, tableRows]
    ),
  });

  // Virtualize columns
  const {
    virtualItems: virtualCols,
    totalSize: totalWidth,
    scrollToIndex: scrollToColIndex,
  } = useVirtual({
    parentRef: containerRef,
    horizontal: true,
    size: leafColumns.length,
    overscan: 5,
    paddingStart: TABLE_PADDING,
    paddingEnd: TABLE_PADDING,
    estimateSize: useCallback(
      (index: number) => {
        const columnDef = leafColumns[index].columnDef;
        const schemaWidth = columnDef.size;
        const localWidth = columnSizing[columnDef.id || ""];
        const definedWidth = localWidth || schemaWidth;

        if (definedWidth === undefined) return DEFAULT_COL_WIDTH;
        if (definedWidth < MIN_COL_WIDTH && columnDef.id !== "_rowy_select")
          return MIN_COL_WIDTH;
        return definedWidth;
      },
      [leafColumns, columnSizing]
    ),
    rangeExtractor: useCallback(
      (range: Range) => {
        const defaultRange = defaultRangeExtractor(range);
        const frozenColumns = leafColumns
          .filter((c) => c.getIsPinned())
          .map((c) => c.getPinnedIndex());

        const combinedRange = Array.from(
          new Set([...defaultRange, ...frozenColumns])
        ).sort((a, b) => a - b);

        return combinedRange;
      },
      [leafColumns]
    ),
  });

  // Scroll to selected cell
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

  return {
    virtualRows,
    totalHeight,
    scrollToRowIndex,
    virtualCols,
    totalWidth,
    scrollToColIndex,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  };
}

export default useVirtualization;
