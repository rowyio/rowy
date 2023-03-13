import { memo, Suspense, useState, useEffect, useRef } from "react";
import { isEqual } from "lodash-es";
import type { CellContext } from "@tanstack/react-table";

import { Popover, PopoverProps } from "@mui/material";

import EditorCellController from "./EditorCellController";

import { spreadSx } from "@src/utils/ui";
import type { TableRow } from "@src/types/table";
import type {
  IDisplayCellProps,
  IEditorCellProps,
} from "@src/components/fields/types";

export interface ICellOptions {
  /** If the rest of the row’s data is used, set this to true for memoization */
  usesRowData?: boolean;
  /** Handle padding inside the cell component */
  disablePadding?: boolean;
  /** Set popover background to be transparent */
  transparentPopover?: boolean;
  /** Props to pass to MUI Popover component */
  popoverProps?: Partial<PopoverProps>;
}

/** Received from `TableCell` */
export interface IRenderedTableCellProps<TValue = any>
  extends CellContext<TableRow, TValue> {
  value: TValue;
  focusInsideCell: boolean;
  setFocusInsideCell: (focusInside: boolean) => void;
  disabled: boolean;
  rowHeight: number;
}

/**
 * Higher-order component to render each field type’s cell components.
 * Handles when to render read-only `DisplayCell` and `EditorCell`.
 *
 * Memoized to re-render when value, column, focus, or disabled states change.
 * Optionally re-renders when entire row updates.
 *
 * - Renders inline `EditorCell` after a timeout to improve scroll performance
 * - Handles popovers
 * - Renders Suspense for lazy-loaded `EditorCell`
 * - Provides a `tabIndex` prop, so that interactive cell children (like
 *   buttons) cannot be interacted with unless the user has focused in the
 *   cell. Required for accessibility.
 *
 * @param DisplayCellComponent
 * - The lighter cell component to display values. Also displayed when the
 *   column is disabled/read-only.
 *
 *   - Keep these components lightweight, i.e. use base HTML or simple MUI
 *     components. Avoid `Tooltip`, which is heavy.
 *   - Avoid displaying disabled states (e.g. do not reduce opacity/grey out
 *     toggles). This improves the experience of read-only tables for non-admins
 *   - ⚠️ Make sure the disabled state does not render the buttons to open a
 *       popover `EditorCell` (like Single/Multi Select).
 *   - ⚠️ Make sure to use the `tabIndex` prop for buttons and other interactive
 *       elements.
 *   - {@link IDisplayCellProps}
 *
 * @param EditorCellComponent
 * - The heavier cell component to edit values
 *
 *   - `EditorCell` should use the `value` and `onChange` props for the
 *     rendered inputs. Avoid creating another local state here.
 *   - You can pass `null` to `withRenderTableCell()` to always display the
 *     `DisplayCell`.
 *   - ⚠️ If it’s displayed inline, you must call `onSubmit` to save the value
 *       to the database, because it never unmounts.
 *   - ✨ You can reuse your `SideDrawerField` as they take the same props. It
 *       should probably be displayed in a popover.
 *   - ⚠️ Make sure to use the `tabIndex` prop for buttons, text fields, and
 *       other interactive elements.
 *   - {@link IEditorCellProps}
 *
 * @param editorMode
 * - When to display the `EditorCell`
 * 1. **focus** (default): the user has focused on the cell by pressing Enter or
 *    double-clicking,
 * 2. **inline**: always displayed if the cell is editable, or
 * 3. **popover**: inside a popover when a user has focused on the cell
 *    (as above) or clicked a button rendered by `DisplayCell`
 *
 * @param options
 * - Note this is OK to pass as an object since it’s not defined in runtime
 * - {@link ICellOptions}
 */
export default function withRenderTableCell(
  DisplayCellComponent: React.ComponentType<IDisplayCellProps>,
  EditorCellComponent: React.ComponentType<IEditorCellProps> | null,
  editorMode: "focus" | "inline" | "popover" = "focus",
  options: ICellOptions = {}
) {
  return memo(
    function RenderedTableCell({
      row,
      column,
      value,
      focusInsideCell,
      setFocusInsideCell,
      disabled,
      rowHeight,
    }: IRenderedTableCellProps) {
      // Render inline editor cell after timeout on mount
      // to improve scroll performance
      const [inlineEditorReady, setInlineEditorReady] = useState(false);
      useEffect(() => {
        if (editorMode === "inline")
          setTimeout(() => setInlineEditorReady(true));
      }, []);

      // Store ref to rendered DisplayCell to get positioning for PopoverCell
      const displayCellRef = useRef<HTMLDivElement>(null);
      const parentRef = displayCellRef.current?.parentElement;

      // Store Popover open state here so we can add delay for close transition
      const [popoverOpen, setPopoverOpen] = useState(false);
      useEffect(() => {
        if (focusInsideCell) setPopoverOpen(true);
      }, [focusInsideCell]);
      const showPopoverCell = (popover: boolean) => {
        if (popover) {
          setPopoverOpen(true);
          // Need to call this after a timeout, since the cell’s `onClick`
          // event is fired, which sets focusInsideCell false
          setTimeout(() => setFocusInsideCell(true));
        } else {
          setPopoverOpen(false);
          // Call after a timeout to allow the close transition to finish
          setTimeout(() => {
            setFocusInsideCell(false);
            // Focus the cell. Otherwise, it focuses the body.
            parentRef?.focus();
          }, 300);
        }
      };

      // Declare basicCell here so props can be reused by HeavyCellComponent
      const basicCellProps: IDisplayCellProps = {
        value,
        name: column.columnDef.meta!.name,
        type: column.columnDef.meta!.type,
        row: row.original,
        column: column.columnDef.meta!,
        _rowy_ref: row.original._rowy_ref,
        disabled,
        tabIndex: focusInsideCell ? 0 : -1,
        showPopoverCell,
        setFocusInsideCell,
        rowHeight,
      };

      // Show display cell, unless if editorMode is inline
      const displayCell = (
        <div
          className="cell-contents"
          style={options.disablePadding ? { padding: 0 } : undefined}
          ref={displayCellRef}
        >
          <DisplayCellComponent {...basicCellProps} />
        </div>
      );

      if (disabled || (editorMode !== "inline" && !focusInsideCell))
        return displayCell;

      // If the inline editor cell is not ready to be rendered, display nothing
      if (editorMode === "inline" && !inlineEditorReady) return null;

      // Show displayCell as a fallback if intentionally null
      const editorCell = EditorCellComponent ? (
        <Suspense fallback={null}>
          <EditorCellController
            {...basicCellProps}
            EditorCellComponent={EditorCellComponent}
            parentRef={parentRef}
            saveOnUnmount={editorMode !== "inline"}
          />
        </Suspense>
      ) : (
        displayCell
      );

      if (editorMode === "focus" && focusInsideCell) {
        return editorCell;
      }

      if (editorMode === "inline") {
        return (
          <div
            className="cell-contents-contain-none"
            style={options.disablePadding ? { padding: 0 } : undefined}
            ref={displayCellRef}
          >
            {editorCell}
          </div>
        );
      }

      if (editorMode === "popover")
        return (
          <>
            {displayCell}

            <Popover
              open={popoverOpen}
              anchorEl={parentRef}
              onClose={() => showPopoverCell(false)}
              anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
              transformOrigin={{ horizontal: "center", vertical: "top" }}
              {...options.popoverProps}
              sx={[
                {
                  "& .MuiPopover-paper": {
                    backgroundColor: options.transparentPopover
                      ? "transparent"
                      : undefined,
                    boxShadow: options.transparentPopover ? "none" : undefined,
                    minWidth: column.getSize(),
                  },
                },
                ...spreadSx(options.popoverProps?.sx),
              ]}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.stopPropagation()}
            >
              {editorCell}
            </Popover>
          </>
        );

      // Should not reach this line
      return null;
    },
    // Memo function
    (prev, next) => {
      const valueEqual = isEqual(prev.value, next.value);
      const columnEqual = isEqual(
        prev.column.columnDef.meta,
        next.column.columnDef.meta
      );
      const rowEqual = isEqual(prev.row.original, next.row.original);
      const focusInsideCellEqual =
        prev.focusInsideCell === next.focusInsideCell;
      const disabledEqual = prev.disabled === next.disabled;

      const baseEqualities =
        valueEqual && columnEqual && focusInsideCellEqual && disabledEqual;

      if (options?.usesRowData) return baseEqualities && rowEqual;
      else return baseEqualities;
    }
  );
}
