import { memo } from "react";
import { useAtom, useSetAtom } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { flexRender } from "@tanstack/react-table";
import type { Row, Cell } from "@tanstack/react-table";

import { styled } from "@mui/material/styles";
import ErrorIcon from "@mui/icons-material/ErrorOutline";
import WarningIcon from "@mui/icons-material/WarningAmber";

import StyledCell from "./Styled/StyledCell";
import { InlineErrorFallback } from "@src/components/ErrorFallback";
import RichTooltip from "@src/components/RichTooltip";

import {
  tableScope,
  selectedCellAtom,
  contextMenuTargetAtom,
} from "@src/atoms/tableScope";
import { TABLE_PADDING } from "./Table";
import type { TableRow } from "@src/types/table";

const Dot = styled("div")(({ theme }) => ({
  position: "absolute",
  right: -5,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 1,

  width: 12,
  height: 12,

  borderRadius: "50%",
  backgroundColor: theme.palette.error.main,

  boxShadow: `0 0 0 4px var(--cell-background-color)`,
  "[role='row']:hover &": {
    boxShadow: `0 0 0 4px var(--row-hover-background-color)`,
  },
}));

export interface ICellValidationProps {
  row: Row<TableRow>;
  cell: Cell<TableRow, any>;
  index: number;
  isSelectedCell: boolean;
  isReadOnlyCell: boolean;
  canEditCells: boolean;
  rowHeight: number;
  lastFrozen?: string;
  left?: number;
}

export const CellValidation = memo(function MemoizedCellValidation({
  row,
  cell,
  index,
  isSelectedCell,
  isReadOnlyCell,
  canEditCells,
  rowHeight,
  lastFrozen,
  left,
}: ICellValidationProps) {
  const [selectedCell, setSelectedCell] = useAtom(selectedCellAtom, tableScope);
  const focusInsideCell = selectedCell?.focusInside ?? false;
  const setContextMenuTarget = useSetAtom(contextMenuTargetAtom, tableScope);

  const value = cell.getValue();
  const required = cell.column.columnDef.meta?.config?.required;
  const validationRegex = cell.column.columnDef.meta?.config?.validationRegex;

  const isInvalid = validationRegex && !new RegExp(validationRegex).test(value);
  const isMissing = required && value === undefined;

  const renderedCell = (
    <ErrorBoundary fallbackRender={InlineErrorFallback}>
      {flexRender(cell.column.columnDef.cell, {
        ...cell.getContext(),
        focusInsideCell: isSelectedCell && focusInsideCell,
        setFocusInsideCell: (focusInside: boolean) =>
          setSelectedCell({
            path: row.original._rowy_ref.path,
            columnKey: cell.column.id,
            focusInside,
          }),
        disabled:
          !canEditCells || cell.column.columnDef.meta?.editable === false,
        rowHeight,
      })}
    </ErrorBoundary>
  );

  // if (isInvalid)
  //   return (
  //     <StyledCell aria-invalid="true" {...props}>
  //       <RichTooltip
  //         icon={<ErrorIcon fontSize="inherit" color="error" />}
  //         title="Invalid data"
  //         message="This row will not be saved until all the required fields contain valid data"
  //         placement="right"
  //         render={({ openTooltip }) => <Dot onClick={openTooltip} />}
  //       />
  //       {children}
  //     </StyledCell>
  //   );

  // if (isMissing)
  //   return (
  //     <StyledCell aria-invalid="true" {...props}>
  //       <RichTooltip
  //         icon={<WarningIcon fontSize="inherit" color="warning" />}
  //         title="Required field"
  //         message="This row will not be saved until all the required fields contain valid data"
  //         placement="right"
  //         render={({ openTooltip }) => <Dot onClick={openTooltip} />}
  //       />
  //       {children}
  //     </StyledCell>
  //   );

  return (
    <StyledCell
      key={cell.id}
      data-row-id={row.id}
      data-col-id={cell.column.id}
      data-frozen={cell.column.getIsPinned() || undefined}
      data-frozen-last={lastFrozen === cell.column.id || undefined}
      role="gridcell"
      tabIndex={isSelectedCell && !focusInsideCell ? 0 : -1}
      aria-colindex={index + 1}
      aria-readonly={
        !canEditCells || cell.column.columnDef.meta?.editable === false
      }
      aria-required={Boolean(cell.column.columnDef.meta?.config?.required)}
      aria-selected={isSelectedCell}
      aria-describedby={
        canEditCells && !isReadOnlyCell
          ? "rowy-table-editable-cell-description"
          : undefined
      }
      style={{
        width: cell.column.getSize(),
        height: rowHeight,
        left,
        backgroundColor:
          cell.column.id === "_rowy_column_actions" ? "transparent" : undefined,
        borderBottomWidth:
          cell.column.id === "_rowy_column_actions" ? 0 : undefined,
        borderRightWidth:
          cell.column.id === "_rowy_column_actions" ? 0 : undefined,
      }}
      onClick={(e) => {
        setSelectedCell({
          path: row.original._rowy_ref.path,
          columnKey: cell.column.id,
          focusInside: false,
        });
        (e.target as HTMLDivElement).focus();
      }}
      onDoubleClick={(e) => {
        setSelectedCell({
          path: row.original._rowy_ref.path,
          columnKey: cell.column.id,
          focusInside: true,
        });
        (e.target as HTMLDivElement).focus();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setSelectedCell({
          path: row.original._rowy_ref.path,
          columnKey: cell.column.id,
          focusInside: false,
        });
        (e.target as HTMLDivElement).focus();
        setContextMenuTarget(e.target as HTMLElement);
      }}
    >
      {renderedCell}
    </StyledCell>
  );
});

export default CellValidation;
