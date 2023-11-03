import { memo, Fragment } from "react";
import { useAtom } from "jotai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import {
  ColumnSizingState,
  HeaderGroup,
  flexRender,
} from "@tanstack/react-table";
import type { TableRow } from "@src/types/table";

import StyledRow from "./Styled/StyledRow";
import ColumnHeader from "./ColumnHeader";
import FinalColumnHeader from "./FinalColumn/FinalColumnHeader";

import { tableScope, selectedCellAtom } from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";
import StyledColumnHeader from "./Styled/StyledColumnHeader";

export interface ITableHeaderProps {
  /** Headers with context from TanStack Table state */
  headerGroups: HeaderGroup<TableRow>[];
  /** Called when a header is dropped in a new position */
  handleDropColumn: (result: DropResult) => void;
  /** Passed to `FinalColumnHeader` */
  canAddColumns: boolean;
  /** Determines if columns can be re-ordered */
  canEditColumns: boolean;
  /** If specified, renders a shadow in the last frozen column */
  lastFrozen?: string;
  /**
   * Must pass this prop so that it re-renders when local column sizing changes */
  columnSizing: ColumnSizingState;
}

/**
 * Renders table header row. Memoized to only re-render when column definitions
 * and sizes change.
 *
 * - Renders drag & drop components
 */
export const TableHeader = memo(function TableHeader({
  headerGroups,
  handleDropColumn,
  canAddColumns,
  canEditColumns,
  lastFrozen,
}: ITableHeaderProps) {
  const [selectedCell] = useAtom(selectedCellAtom, tableScope);
  const focusInside = selectedCell?.focusInside ?? false;

  return (
    <DragDropContext onDragEnd={handleDropColumn}>
      {headerGroups.map((headerGroup, _i) => (
        <Droppable
          key={_i}
          droppableId="droppable-column"
          direction="horizontal"
        >
          {(provided) => (
            <StyledRow
              key={headerGroup.id}
              role="row"
              aria-rowindex={1}
              style={{ height: DEFAULT_ROW_HEIGHT + 1 }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {headerGroup.headers.map((header, i) => {
                const isSelectedCell =
                  (!selectedCell && header.index === 0) ||
                  (selectedCell?.path === "_rowy_header" &&
                    selectedCell?.columnKey === header.id);

                const isLastHeader = i === headerGroup.headers.length - 1;

                if (header.id === "_rowy_select")
                  return (
                    <StyledColumnHeader
                      key={header.id}
                      role="columnheader"
                      style={{ padding: 0, zIndex: 11 }}
                      data-frozen="left"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </StyledColumnHeader>
                  );

                // Render later, after the drag & drop placeholder
                if (header.id === "_rowy_column_actions")
                  return (
                    <Fragment key={header.id}>
                      {provided.placeholder}
                      <FinalColumnHeader
                        key={header.id}
                        data-row-id={"_rowy_header"}
                        data-col-id={header.id}
                        tabIndex={isSelectedCell ? 0 : -1}
                        focusInsideCell={isSelectedCell && focusInside}
                        aria-colindex={header.index + 1}
                        aria-readonly={!canEditColumns}
                        aria-selected={isSelectedCell}
                        canAddColumns={canAddColumns}
                      />
                    </Fragment>
                  );

                if (!header.column.columnDef.meta) return null;

                const draggableHeader = (
                  <Draggable
                    key={header.id}
                    draggableId={header.id}
                    index={header.index}
                    isDragDisabled={!canEditColumns}
                    disableInteractiveElementBlocking
                  >
                    {(provided, snapshot) => (
                      <ColumnHeader
                        header={header}
                        column={header.column.columnDef.meta!}
                        provided={provided}
                        snapshot={snapshot}
                        width={header.getSize()}
                        isSelectedCell={isSelectedCell}
                        focusInsideCell={isSelectedCell && focusInside}
                        canEditColumns={canEditColumns}
                        isLastFrozen={lastFrozen === header.id}
                      />
                    )}
                  </Draggable>
                );

                if (isLastHeader)
                  return (
                    <Fragment key={header.id}>
                      {draggableHeader}
                      {provided.placeholder}
                    </Fragment>
                  );
                else return draggableHeader;
              })}
            </StyledRow>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
});

export default TableHeader;
