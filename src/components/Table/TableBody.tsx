import { useAtom } from "jotai";
import type { Column, Row } from "@tanstack/react-table";

import StyledRow from "./Styled/StyledRow";
import OutOfOrderIndicator from "./OutOfOrderIndicator";
import CellValidation from "./CellValidation";

import {
  tableScope,
  tableSchemaAtom,
  selectedCellAtom,
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
  containerRef: React.RefObject<HTMLDivElement>;
  leafColumns: Column<TableRow, unknown>[];
  rows: Row<TableRow>[];

  canEditCells: boolean;
  lastFrozen?: string;
}

export default function TableBody({
  containerRef,
  leafColumns,
  rows,
  canEditCells,
  lastFrozen,
}: ITableBodyProps) {
  const [tableSchema] = useAtom(tableSchemaAtom, tableScope);
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);

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
                <CellValidation
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
                  isReadOnlyCell={isReadOnlyCell}
                  canEditCells={canEditCells}
                  lastFrozen={lastFrozen}
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

      {paddingBottom > 0 && (
        <div role="presentation" style={{ height: `${paddingBottom}px` }} />
      )}
    </div>
  );
}
