import { memo } from "react";
import { useAtom } from "jotai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import type { HeaderGroup } from "@tanstack/react-table";
import type { TableRow } from "@src/types/table";

import StyledRow from "./Styled/StyledRow";
import ColumnHeader from "./ColumnHeader";
import StyledResizer from "./Styled/StyledResizer";
import FinalColumnHeader from "./FinalColumn/FinalColumnHeader";
import { DragVertical } from "@src/assets/icons";

import { tableScope, selectedCellAtom } from "@src/atoms/tableScope";
import { DEFAULT_ROW_HEIGHT, TABLE_PADDING } from "@src/components/Table";

export interface ITableHeaderGroupProps {
  headerGroups: HeaderGroup<TableRow>[];
  handleDropColumn: (result: DropResult) => void;
  canAddColumns: boolean;
  canEditColumns: boolean;
  lastFrozen?: string;
}

export const TableHeaderGroup = memo(function TableHeaderGroup({
  headerGroups,
  handleDropColumn,
  canAddColumns,
  canEditColumns,
  lastFrozen,
}: ITableHeaderGroupProps) {
  const [selectedCell, setSelectedCell] = useAtom(selectedCellAtom, tableScope);
  const focusInsideCell = selectedCell?.focusInside ?? false;

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
                      focusInsideCell={isSelectedCell && focusInsideCell}
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
                        key={header.id}
                        data-row-id={"_rowy_header"}
                        data-col-id={header.id}
                        data-frozen={header.column.getIsPinned() || undefined}
                        data-frozen-last={lastFrozen === header.id || undefined}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        tabIndex={isSelectedCell ? 0 : -1}
                        aria-colindex={header.index + 1}
                        aria-readonly={!canEditColumns}
                        aria-selected={isSelectedCell}
                        column={header.column.columnDef.meta!}
                        style={{
                          width: header.getSize(),
                          left: header.column.getIsPinned()
                            ? header.column.getStart() - TABLE_PADDING
                            : undefined,
                          ...provided.draggableProps.style,
                          zIndex: header.column.getIsPinned() ? 11 : 10,
                        }}
                        width={header.getSize()}
                        sx={
                          snapshot.isDragging
                            ? undefined
                            : { "& + &": { borderLeft: "none" } }
                        }
                        onClick={(e) => {
                          setSelectedCell({
                            path: "_rowy_header",
                            columnKey: header.id,
                            focusInside: false,
                          });
                          (e.target as HTMLDivElement).focus();
                        }}
                        onDoubleClick={(e) => {
                          setSelectedCell({
                            path: "_rowy_header",
                            columnKey: header.id,
                            focusInside: true,
                          });
                          (e.target as HTMLDivElement).focus();
                        }}
                        focusInsideCell={isSelectedCell && focusInsideCell}
                      >
                        <div
                          {...provided.dragHandleProps}
                          tabIndex={isSelectedCell && focusInsideCell ? 0 : -1}
                          aria-describedby={
                            isSelectedCell && focusInsideCell
                              ? provided.dragHandleProps?.["aria-describedby"]
                              : undefined
                          }
                          style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 0,
                            display: "flex",
                            alignItems: "center",
                            outline: "none",
                          }}
                          className="column-drag-handle"
                        >
                          <DragVertical
                            sx={{
                              opacity: 0,
                              borderRadius: 2,
                              transition: (theme) =>
                                theme.transitions.create(["opacity"]),
                              "[role='columnheader']:hover &, [role='columnheader']:focus-within &":
                                {
                                  opacity: 0.5,
                                },
                              ".column-drag-handle:hover &": {
                                opacity: 1,
                              },
                              ".column-drag-handle:active &": {
                                opacity: 1,
                                color: "primary.main",
                              },
                              ".column-drag-handle:focus &": {
                                opacity: 1,
                                color: "primary.main",
                                outline: "2px solid",
                                outlineColor: "primary.main",
                              },
                            }}
                            style={{ width: 8 }}
                            preserveAspectRatio="xMidYMid slice"
                          />
                        </div>

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
  );
});

export default TableHeaderGroup;
