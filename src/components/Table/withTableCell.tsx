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
import { get, isEqual } from "lodash-es";
import type { TableCellProps } from "@src/components/Table";
import {
  IDisplayCellProps,
  IEditorCellProps,
} from "@src/components/fields/types";

import { Popover, PopoverProps } from "@mui/material";

import {
  tableScope,
  updateFieldAtom,
  sideDrawerOpenAtom,
} from "@src/atoms/tableScope";
import { spreadSx } from "@src/utils/ui";

export interface ICellOptions {
  /** If the rest of the row’s data is used, set this to true for memoization */
  usesRowData?: boolean;
  /** Handle padding inside the cell component */
  disablePadding?: boolean;
  /** Set popover background to be transparent */
  transparent?: boolean;
  /** Props to pass to MUI Popover component */
  popoverProps?: Partial<PopoverProps>;
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
      getValue,
      focusInsideCell,
      setFocusInsideCell,
      disabled,
    }: TableCellProps) {
      const value = getValue();

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
        docRef: row.original._rowy_ref,
        _rowy_ref: row.original._rowy_ref,
        disabled: column.columnDef.meta!.editable === false,
        tabIndex: focusInsideCell ? 0 : -1,
        showPopoverCell,
        setFocusInsideCell,
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

      // Show displayCell as a fallback if intentionally null
      const editorCell = EditorCellComponent ? (
        <EditorCellManager
          {...basicCellProps}
          EditorCellComponent={EditorCellComponent}
          parentRef={parentRef}
          saveOnUnmount={editorMode === "focus"}
        />
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

            <Suspense fallback={null}>
              <Popover
                open={popoverOpen}
                anchorEl={parentRef}
                onClose={() => showPopoverCell(false)}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                {...options.popoverProps}
                sx={[
                  {
                    "& .MuiPopover-paper": {
                      backgroundColor: options.transparent
                        ? "transparent"
                        : undefined,
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
            </Suspense>
          </>
        );

      // Should not reach this line
      return null;
    },
    (prev, next) => {
      const valueEqual = isEqual(
        get(prev.row.original, prev.column.columnDef.meta!.fieldName),
        get(next.row.original, next.column.columnDef.meta!.fieldName)
      );
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
  ...props
}: IEditorCellManagerProps) {
  const [localValue, setLocalValue, localValueRef] = useStateRef(props.value);
  const [, setIsDirty, isDirtyRef] = useStateRef(false);
  const updateField = useSetAtom(updateFieldAtom, tableScope);

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
