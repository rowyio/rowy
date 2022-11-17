import {
  memo,
  Suspense,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import useStateRef from "react-usestateref";
import { useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import type { CellContext } from "@tanstack/react-table";

import { Popover, PopoverProps } from "@mui/material";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
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

export interface ITableCellProps<TValue = any>
  extends CellContext<TableRow, TValue> {
  value: TValue;
  focusInsideCell: boolean;
  setFocusInsideCell: (focusInside: boolean) => void;
  disabled: boolean;
  rowHeight: number;
}

/**
 * HOC to render table cells.
 * Renders read-only DisplayCell while scrolling for scroll performance.
 * Defers render for inline EditorCell.
 * @param DisplayCellComponent - The lighter cell component to display values
 * @param EditorCellComponent - The heavier cell component to edit inline
 * @param editorMode - When to display the EditorCell
 *   - "focus" (default) - when the cell is focused (Enter or double-click)
 *   - "inline" - inline with deferred render
 *   - "popover" - as a popover
 * @param options - {@link ICellOptions}
 */
export default function withTableCell(
  DisplayCellComponent: React.ComponentType<IDisplayCellProps>,
  EditorCellComponent: React.ComponentType<IEditorCellProps> | null,
  editorMode: "focus" | "inline" | "popover" = "focus",
  options: ICellOptions = {}
) {
  return memo(
    function TableCell({
      row,
      column,
      value,
      focusInsideCell,
      setFocusInsideCell,
      disabled,
      rowHeight,
    }: ITableCellProps) {
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
        disabled: column.columnDef.meta!.editable === false,
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
          <EditorCellManager
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
            className="cell-contents"
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

interface IEditorCellManagerProps extends IDisplayCellProps {
  EditorCellComponent: React.ComponentType<IEditorCellProps>;
  parentRef: IEditorCellProps["parentRef"];
  saveOnUnmount: boolean;
}

function EditorCellManager({
  EditorCellComponent,
  saveOnUnmount,
  value,
  ...props
}: IEditorCellManagerProps) {
  // Store local value so we don’t immediately write to db when the user
  // types in a textbox, for example
  const [localValue, setLocalValue, localValueRef] = useStateRef(value);
  // Mark if the user has interacted with this cell and hasn’t saved yet
  const [isDirty, setIsDirty, isDirtyRef] = useStateRef(false);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

  // When this cell’s data has updated, update the local value if
  // it’s not dirty and the value is different
  useEffect(() => {
    if (!isDirty && !isEqual(value, localValueRef.current))
      setLocalValue(value);
  }, [isDirty, localValueRef, setLocalValue, value]);

  // This is where we update the documents
  const handleSubmit = () => {
    if (props.disabled || !isDirtyRef.current) return;

    updateField({
      path: props._rowy_ref.path,
      fieldName: props.column.fieldName,
      value: localValueRef.current,
      deleteField: localValueRef.current === undefined,
    });
  };

  useLayoutEffect(() => {
    return () => {
      if (saveOnUnmount) {
        console.log("unmount", props._rowy_ref.path, props.column.fieldName);
        handleSubmit();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditorCellComponent
      {...props}
      value={localValue}
      onDirty={(dirty?: boolean) => setIsDirty(dirty ?? true)}
      onChange={(v) => {
        setIsDirty(true);
        setLocalValue(v);
      }}
      onSubmit={handleSubmit}
    />
  );
}
