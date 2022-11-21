import { memo } from "react";
import { useAtom } from "jotai";
import type { Column, Row, ColumnSizingState } from "@tanstack/react-table";

import StyledRow from "./Styled/StyledRow";
import OutOfOrderIndicator from "./OutOfOrderIndicator";
import TableCell from "./TableCell";
import { RowsSkeleton } from "./TableSkeleton";

import {
  tableScope,
  tableSchemaAtom,
  selectedCellAtom,
  tableNextPageAtom,
} from "@src/atoms/tableScope";

import { getFieldProp } from "@src/components/fields";
import type { TableRow } from "@src/types/table";
import useVirtualization from "./useVirtualization";
import {
  TABLE_PADDING,
  DEFAULT_ROW_HEIGHT,
  OUT_OF_ORDER_MARGIN,
} from "./Table";

export interface ITableBodyProps {
  /**
   * Re-render this component when the container element changes, to fix a bug
   * where virtualization doesn’t detect scrolls if `containerRef.current` was
   * initially null
   */
  containerEl: HTMLDivElement | null;
  /** Used in `useVirtualization` */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Used in `useVirtualization` */
  leafColumns: Column<TableRow, unknown>[];
  /** Current table rows with context from TanStack Table state */
  rows: Row<TableRow>[];
  /** Determines if EditorCell can be displayed */
  canEditCells: boolean;
  /** If specified, renders a shadow in the last frozen column */
  lastFrozen?: string;
  /**
   * Must pass this prop so that it re-renders when local column sizing changes */
  columnSizing: ColumnSizingState;
}

/**
 * Renders table body & data rows.
 * Handles virtualization of rows & columns via `useVirtualization`.
 *
 * - Renders row out of order indicator
 * - Renders next page loading UI (`RowsSkeleton`)
 */
export const TableBody = memo(function TableBody({
  containerRef,
  leafColumns,
  rows,
  canEditCells,
  lastFrozen,
}: ITableBodyProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const [tableNextPage] = useAtom(tableNextPageAtom, tableScope);

  const {
    virtualRows,
    virtualCols,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  } = useVirtualization(containerRef, leafColumns);

  return (
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
              <div role="presentation" style={{ width: `${paddingLeft}px` }} />
            )}

            {outOfOrder && <OutOfOrderIndicator />}

            {virtualCols.map((virtualCell) => {
              const cellIndex = virtualCell.index;
              const cell = row.getVisibleCells()[cellIndex];

              const isSelectedCell =
                selectedCell?.path === row.original._rowy_ref.path &&
                selectedCell?.columnKey === cell.column.id;

              const fieldTypeGroup = getFieldProp(
                "group",
                cell.column.columnDef.meta?.type
              );
              const isReadOnlyCell =
                fieldTypeGroup === "Auditing" || fieldTypeGroup === "Metadata";

              return (
                <TableCell
                  key={cell.id}
                  row={row}
                  cell={cell}
                  index={cellIndex}
                  left={
                    cell.column.getIsPinned()
                      ? virtualCell.start - TABLE_PADDING
                      : undefined
                  }
                  isSelectedCell={isSelectedCell}
                  focusInsideCell={isSelectedCell && selectedCell?.focusInside}
                  isReadOnlyCell={isReadOnlyCell}
                  canEditCells={canEditCells}
                  isLastFrozen={lastFrozen === cell.column.id}
                  width={cell.column.getSize()}
                  rowHeight={tableSchema.rowHeight || DEFAULT_ROW_HEIGHT}
                />
              );
            })}

            {paddingRight > 0 && (
              <div role="presentation" style={{ width: `${paddingRight}px` }} />
            )}
          </StyledRow>
        );
      })}

      {tableNextPage.loading && <RowsSkeleton />}

      {paddingBottom > 0 && (
        <div role="presentation" style={{ height: `${paddingBottom}px` }} />
      )}
    </div>
  );
});

export default TableBody;
