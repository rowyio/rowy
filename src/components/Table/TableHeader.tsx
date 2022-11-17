import { memo } from "react";
import { useAtom } from "jotai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import type { ColumnSizingState, HeaderGroup } from "@tanstack/react-table";
import type { TableRow } from "@src/types/table";

import StyledRow from "./Styled/StyledRow";
import ColumnHeader from "./ColumnHeader";
import FinalColumnHeader from "./FinalColumn/FinalColumnHeader";

import { tableScope, selectedCellAtom } from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT } from "@src/components/Table";

export interface ITableHeaderProps {
  headerGroups: HeaderGroup<TableRow>[];
  handleDropColumn: (result: DropResult) => void;
  canAddColumns: boolean;
  canEditColumns: boolean;
  lastFrozen?: string;

  /** Re-render when local column sizing changes */
  columnSizing: ColumnSizingState;
}

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
      {headerGroups.map((headerGroup) => (
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
                      focusInsideCell={isSelectedCell && focusInside}
                      aria-colindex={header.index + 1}
                      aria-readonly={!canEditColumns}
                      aria-selected={isSelectedCell}
                      canAddColumns={canAddColumns}
                    />
                  );

                if (!header.column.columnDef.meta) return null;

                return (
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
              })}
              {provided.placeholder}
            </StyledRow>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
});

export default TableHeader;
