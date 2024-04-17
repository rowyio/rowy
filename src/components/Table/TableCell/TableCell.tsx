import { memo, useMemo, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { flexRender } from "@tanstack/react-table";
import type { Row, Cell, Table } from "@tanstack/react-table";

import ErrorIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/WarningAmber";

import StyledCell from "@src/components/Table/Styled/StyledCell";
import { InlineErrorFallback } from "@src/components/ErrorFallback";
import RichTooltip from "@src/components/RichTooltip";
import StyledDot from "@src/components/Table/Styled/StyledDot";

import {
  tableScope,
  selectedCellAtom,
  contextMenuTargetAtom,
  selectedCopyCellsAtom,
  endCellAtom,
} from "@src/atoms/tableScope";
import { TABLE_PADDING } from "@src/components/Table";
import type { TableRow } from "@src/types/table";
import type { IRenderedTableCellProps } from "./withRenderTableCell";
import React from "react";
import {
  getCellStyle,
  getCopySelectedCellStyle,
  getDragDropShowStyles,
} from "@src/utils/table";
import ActionIcon from "@mui/icons-material/TouchAppOutlined";
import { isEmpty } from "lodash-es";
import { PaletteOptions } from "@mui/material";

export interface ITableCellProps {
  /** Current row with context from TanStack Table state */
  row: Row<TableRow>;
  /** Current cell with context from TanStack Table state */
  cell: Cell<TableRow, any>;
  /** Virtual cell index (column index) */
  index: number;
  /** User has clicked or navigated to this cell */
  isSelectedCell: boolean;
  /** User has double-clicked or pressed Enter and this cell is selected */
  focusInsideCell: boolean;
  /**
   * Used to disable `aria-description` that says “Press Enter to edit”
   * for Auditing and Metadata cells. Need to find another way to do this.
   */
  isReadOnlyCell: boolean;
  /** Determines if EditorCell can be displayed */
  canEditCells: boolean;
  /**
   * Pass current row height as a prop so we don’t access `tableSchema` here.
   * If that atom is listened to here, all table cells will re-render whenever
   * `tableSchema` changes, which is unnecessary.
   */
  rowHeight: number;
  /** If true, renders a shadow */
  isLastFrozen: boolean;
  /** Pass width as a prop to get local column sizing state */
  width: number;
  /**
   * If provided, cell is pinned/frozen, and this value is used for
   * `position: sticky`.
   */
  left: number;
  isPinned: boolean;
  tableInstance?: Table<TableRow>;
  rowIndex: number;
  startDrag: Function;
  isDragging: boolean;
}

/**
 * Renders the container div for each cell with accessibility attributes for
 * keyboard navigation.
 *
 * - Performs regex & missing value check and renders associated UI
 * - Provides children with value from `cell.getValue()` so they can work with
 *   memoization
 * - Provides helpers as props to aid with memoization, so children components
 *   don’t have to read atoms, which may cause unnecessary re-renders of many
 *   cell components
 * - Renders `ErrorBoundary`
 */
export const TableCell = memo(function TableCell({
  row,
  cell,
  index,
  isSelectedCell,
  focusInsideCell,
  isReadOnlyCell,
  canEditCells,
  rowHeight,
  isLastFrozen,
  width,
  left,
  isPinned,
  tableInstance,
  rowIndex,
  startDrag,
  isDragging,
}: ITableCellProps) {
  const setSelectedCell = useSetAtom(selectedCellAtom, tableScope);
  const setContextMenuTarget = useSetAtom(contextMenuTargetAtom, tableScope);
  //selecting cells for copying
  const [selectedCopyCells, setSelectedCopyCells] = useAtom(
    selectedCopyCellsAtom,
    tableScope
  );
  const [endCellId, setEndCellId] = useAtom(endCellAtom, tableScope);

  const value = cell.getValue();
  const required = cell.column.columnDef.meta?.config?.required;
  const validationRegex = cell.column.columnDef.meta?.config?.validationRegex;

  const isInvalid = validationRegex && !new RegExp(validationRegex).test(value);
  const isMissing = required && value === undefined;
  const row_index = rowIndex;
  const cell_index = index;
  let renderedValidationTooltip = null;
  let renderDragAndDropTooltip = null;

  const cellStyles = useMemo(() => {
    return getCellStyle(selectedCopyCells, row_index, cell_index, endCellId);
  }, [
    selectedCopyCells,
    row_index,
    cell_index,
    endCellId,
  ]) as React.CSSProperties;

  const copySelectedStyle = useMemo(() => {
    return getCopySelectedCellStyle(
      selectedCopyCells,
      endCellId,
      tableInstance,
      row_index,
      cell_index
    );
  }, [
    endCellId,
    selectedCopyCells,
    tableInstance,
    row_index,
    cell_index,
  ]) as React.CSSProperties;

  const dragShowStyle = useMemo(() => {
    return getDragDropShowStyles(selectedCopyCells, row_index, cell_index);
  }, [cell_index, row_index, selectedCopyCells]);

  const handleCellClick = (
    cell: Cell<TableRow, any>,
    e: any,
    rowIndex: number
  ) => {
    const cellIndex = cell
      .getContext()
      .row._getAllVisibleCells()
      .findIndex((c) => cell.id === c.id);
    setSelectedCopyCells({
      cell,
      isfirstSelectedCell: true,
      left: cellIndex,
      right: cellIndex,
      up: rowIndex,
      down: rowIndex,
      rowIndex,
      cellIndex,
    });
    setEndCellId(null);
  };

  if (isInvalid) {
    renderedValidationTooltip = (
      <RichTooltip
        icon={<ErrorIcon fontSize="inherit" color="error" />}
        title="Invalid data"
        message="This row will not be saved until all the required fields contain valid data"
        placement="right"
        render={({ openTooltip }) => <StyledDot onClick={openTooltip} />}
      />
    );
  } else if (isMissing) {
    renderedValidationTooltip = (
      <RichTooltip
        icon={<WarningIcon fontSize="inherit" color="warning" />}
        title="Required field"
        message="This row will not Row out of orderbe saved until all the required fields contain valid data"
        placement="right"
        render={({ openTooltip }) => <StyledDot onClick={openTooltip} />}
      />
    );
  }

  if (!isMissing && dragShowStyle === "block") {
    renderDragAndDropTooltip = (
      <RichTooltip
        icon={<ActionIcon fontSize="inherit" color="info" />}
        title="Drag to Copy"
        message={
          <>
            <div>Instructions:</div>
            <div>
              - To select cells, start by clicking on a cell, then hold down the
              Shift key while using the arrow keys to expand the selection to
              include the desired cells.
            </div>
            <div>
              - To copy cells, click and drag over the selected cells, then drag
              the selection to the desired location where you want to copy them.
            </div>
          </>
        }
        placement="right"
        render={({ openTooltip }) => (
          <StyledDot
            sx={{
              bottom: "-10px",
              right: "-5px",
              top: "auto",
              cursor: "crosshair",
            }}
            paletteKey="primary"
            onClick={openTooltip}
            onMouseDown={(e) =>
              startDrag(
                e as unknown as MouseEvent,
                `show_${cell.id}__${row.id}`
              )
            }
          />
        )}
      />
    );
  }

  const tableCellComponentProps: IRenderedTableCellProps = {
    ...cell.getContext(),
    value,
    focusInsideCell,
    setFocusInsideCell: (focusInside: boolean) =>
      setSelectedCell({
        arrayIndex: row.original._rowy_ref.arrayTableData?.index,
        path: row.original._rowy_ref.path,
        columnKey: cell.column.id,
        focusInside,
      }),
    disabled: !canEditCells || cell.column.columnDef.meta?.editable === false,
    rowHeight,
  };

  let paletteKey = !isEmpty(cellStyles)
    ? "primary"
    : !isEmpty(copySelectedStyle)
    ? "secondary"
    : (null as keyof PaletteOptions | null);

  return (
    <StyledCell
      id={`${rowIndex}__${cell.id}__${row.id}`}
      aria-disabled={!!endCellId}
      key={cell.id}
      data-row-id={row.id}
      data-col-id={cell.column.id}
      data-frozen={cell.column.getIsPinned() || undefined}
      data-frozen-last={isLastFrozen || undefined}
      role="gridcell"
      tabIndex={isSelectedCell && !focusInsideCell ? 0 : -1}
      aria-colindex={index + 1}
      aria-readonly={
        !canEditCells || cell.column.columnDef.meta?.editable === false
      }
      paletteKey={paletteKey}
      aria-required={Boolean(cell.column.columnDef.meta?.config?.required)}
      aria-selected={isSelectedCell}
      aria-describedby={
        canEditCells && !isReadOnlyCell
          ? "rowy-table-editable-cell-description"
          : undefined
      }
      aria-invalid={isInvalid || isMissing}
      style={{
        ...{
          width,
          height: rowHeight,
          position: isPinned ? "sticky" : "absolute",
          left: left - (isPinned ? TABLE_PADDING : 0),
          backgroundColor:
            cell.column.id === "_rowy_column_actions"
              ? "transparent"
              : undefined,
          borderBottomWidth:
            cell.column.id === "_rowy_column_actions" ? 0 : undefined,
          borderRightWidth:
            cell.column.id === "_rowy_column_actions" ? 0 : undefined,
        },
      }}
      color={paletteKey ?? "primary"}
      onClick={(e) => {
        setSelectedCell({
          arrayIndex: row.original._rowy_ref.arrayTableData?.index,
          path: row.original._rowy_ref.path,
          columnKey: cell.column.id,
          focusInside: false,
        });
        (e.target as HTMLDivElement).focus();
        if (!endCellId) handleCellClick(cell, e, rowIndex);
      }}
      onDoubleClick={(e) => {
        setSelectedCell({
          arrayIndex: row.original._rowy_ref.arrayTableData?.index,
          path: row.original._rowy_ref.path,
          columnKey: cell.column.id,
          focusInside: true,
        });
        (e.target as HTMLDivElement).focus();
        setSelectedCopyCells(null);
        setEndCellId(null);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        let isEditorCell = false;

        setSelectedCell((prev) => {
          isEditorCell = prev?.focusInside === true;
          return {
            arrayIndex: row.original._rowy_ref.arrayTableData?.index,
            path: row.original._rowy_ref.path,
            columnKey: cell.column.id,
            focusInside: false,
          };
        });
        (e.target as HTMLDivElement).focus();
        if (!isEditorCell) {
          setContextMenuTarget(e.target as HTMLElement);
        }
      }}
      onMouseMove={(e) => {
        e.preventDefault();
        if (!isDragging) {
          return;
        }
        setEndCellId(`${rowIndex}__${cell.id}__${row.id}`);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        if (!isDragging) {
          return;
        }
        setSelectedCell({
          arrayIndex: row.original._rowy_ref.arrayTableData?.index,
          path: row.original._rowy_ref.path,
          columnKey: cell.column.id,
          focusInside: false,
        });
        (e.target as HTMLDivElement).focus();
      }}
    >
      {renderedValidationTooltip}
      {renderDragAndDropTooltip}
      <ErrorBoundary fallbackRender={InlineErrorFallback}>
        {flexRender(cell.column.columnDef.cell, tableCellComponentProps)}
      </ErrorBoundary>
    </StyledCell>
  );
});

export default TableCell;
