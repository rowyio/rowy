import { memo, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import type { Header } from "@tanstack/react-table";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

import {
  Tooltip,
  Fade,
  StackProps,
  IconButton,
  Typography,
} from "@mui/material";
import DropdownIcon from "@mui/icons-material/MoreHoriz";
import LockIcon from "@mui/icons-material/LockOutlined";

import {
  StyledColumnHeader,
  StyledColumnHeaderNameTooltip,
} from "@src/components/Table/Styled/StyledColumnHeader";
import ColumnHeaderSort, { SORT_STATES } from "./ColumnHeaderSort";
import ColumnHeaderDragHandle from "./ColumnHeaderDragHandle";
import ColumnHeaderResizer from "./ColumnHeaderResizer";

import { projectScope, altPressAtom } from "@src/atoms/projectScope";
import {
  tableScope,
  selectedCellAtom,
  columnMenuAtom,
  tableSortsAtom,
} from "@src/atoms/tableScope";
import { getFieldProp } from "@src/components/fields";
import { FieldType } from "@src/constants/fields";
import { COLUMN_HEADER_HEIGHT } from "@src/components/Table/Mock/Column";
import type { ColumnConfig } from "@src/types/table";
import type { TableRow } from "@src/types/table";

export { COLUMN_HEADER_HEIGHT };

export interface IColumnHeaderProps
  extends Partial<Omit<StackProps, "style" | "sx">> {
  header: Header<TableRow, any>;
  column: ColumnConfig;

  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;

  width: number;
  isSelectedCell: boolean;
  focusInsideCell: boolean;
  canEditColumns: boolean;
  isLastFrozen: boolean;
}

/**
 * Renders UI components for each column header, including accessibility
 * attributes. Memoized to prevent re-render when resizing or reordering other
 * columns.
 *
 * Renders:
 * - Drag handle (accessible)
 * - Field type icon + click to copy field key
 * - Field name + hover to view full name if cut off
 * - Sort button
 * - Resize handle (not accessible)
 */
export const ColumnHeader = memo(function ColumnHeader({
  header,
  column,
  provided,
  snapshot,
  width,
  isSelectedCell,
  focusInsideCell,
  canEditColumns,
  isLastFrozen,
}: IColumnHeaderProps) {
  const openColumnMenu = useSetAtom(columnMenuAtom, tableScope);
  const setSelectedCell = useSetAtom(selectedCellAtom, tableScope);
  const [altPress] = useAtom(altPressAtom, projectScope);
  const [tableSorts] = useAtom(tableSortsAtom, tableScope);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openColumnMenu({ column, anchorEl: buttonRef.current });
  };

  const _sortKey = getFieldProp("sortKey", (column as any).type);
  const sortKey = _sortKey ? `${column.key}.${_sortKey}` : column.key;
  const currentSort: typeof SORT_STATES[number] =
    tableSorts[0]?.key !== sortKey
      ? "none"
      : tableSorts[0]?.direction || "none";

  return (
    <StyledColumnHeader
      role="columnheader"
      id={`column-header-${column.key}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      data-row-id={"_rowy_header"}
      data-col-id={header.id}
      data-frozen={header.column.getIsPinned() || undefined}
      data-frozen-last={isLastFrozen || undefined}
      tabIndex={isSelectedCell ? 0 : -1}
      aria-colindex={header.index + 1}
      aria-readonly={!canEditColumns}
      aria-selected={isSelectedCell}
      aria-sort={
        currentSort === "none"
          ? "none"
          : currentSort === "asc"
          ? "ascending"
          : "descending"
      }
      style={{
        left: header.column.getIsPinned()
          ? header.column.getStart()
          : undefined,
        zIndex: header.column.getIsPinned() ? 11 : 10,
        ...provided.draggableProps.style,
        width,
        borderLeftStyle: snapshot.isDragging ? "solid" : undefined,
      }}
      onContextMenu={handleOpenMenu}
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
    >
      {provided.dragHandleProps && (
        <ColumnHeaderDragHandle
          dragHandleProps={provided.dragHandleProps}
          tabIndex={focusInsideCell ? 0 : -1}
        />
      )}

      {width > 140 && (
        <Tooltip
          title={
            <>
              Click to copy field key:
              <br />
              <code style={{ padding: 0 }}>{column.key}</code>
            </>
          }
          enterDelay={1000}
          placement="bottom-start"
          arrow
        >
          <div
            onClick={() => {
              navigator.clipboard.writeText(column.key);
            }}
            style={{ position: "relative", zIndex: 2 }}
          >
            {column.editable === false ? (
              <LockIcon />
            ) : (
              getFieldProp("icon", (column as any).type)
            )}
          </div>
        </Tooltip>
      )}

      <StyledColumnHeaderNameTooltip
        title={
          <Typography
            sx={{
              typography: "caption",
              fontWeight: "fontWeightMedium",
              lineHeight: `${COLUMN_HEADER_HEIGHT - 2 - 4}px`,
              textOverflow: "clip",
            }}
            color="inherit"
          >
            {column.name as string}
          </Typography>
        }
        enterDelay={1000}
        placement="bottom-start"
        disableInteractive
        TransitionComponent={Fade}
        sx={{ "& .MuiTooltip-tooltip": { marginTop: "-28px !important" } }}
      >
        <Typography
          noWrap
          sx={{
            typography: "caption",
            fontWeight: "fontWeightMedium",
            textOverflow: "clip",
            position: "relative",
            zIndex: 1,

            flexGrow: 1,
            flexShrink: 1,
            overflow: "hidden",
            my: 0,
            ml: 0.5,
            mr: -30 / 8,
          }}
          component="div"
          color="inherit"
        >
          {altPress ? (
            <>
              {column.index} <code>{column.fieldName}</code>
            </>
          ) : (
            column.name
          )}
        </Typography>
      </StyledColumnHeaderNameTooltip>

      {column.type !== FieldType.id && (
        <ColumnHeaderSort
          sortKey={sortKey}
          currentSort={currentSort}
          tabIndex={focusInsideCell ? 0 : -1}
          canEditColumns={canEditColumns}
        />
      )}

      <Tooltip title="Column settings">
        <IconButton
          size="small"
          tabIndex={focusInsideCell ? 0 : -1}
          id={`column-settings-${column.key}`}
          onClick={handleOpenMenu}
          ref={buttonRef}
        >
          <DropdownIcon />
        </IconButton>
      </Tooltip>

      {header.column.getCanResize() && (
        <ColumnHeaderResizer
          isResizing={header.column.getIsResizing()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
        />
      )}
    </StyledColumnHeader>
  );
});

export default ColumnHeader;
