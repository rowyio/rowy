import React, { Suspense, useState, useEffect, useRef } from "react";
import { FormatterProps } from "react-data-grid";
import {
  IPopoverCellProps,
  IPopoverBasicCellProps,
} from "components/fields/types";

import {
  makeStyles,
  createStyles,
  Popover,
  PopoverProps,
} from "@material-ui/core";

import ErrorBoundary from "components/ErrorBoundary";
import { useFiretableContext } from "contexts/FiretableContext";

import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";

const useStyles = makeStyles((theme) =>
  createStyles({
    transparentPaper: {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
  })
);

export interface IPopoverCellOptions extends Partial<PopoverProps> {
  transparent?: boolean;
  readOnly?: boolean;
}

/**
 * HOC to wrap around custom cell formatters.
 * Renders BasicCell while scrolling for better scroll performance.
 * @param Cell The cell component to display
 * @param BasicCell The lighter cell component to display while scrolling
 * @param readOnly Prevent the formatter from updating the cell value
 */
export default function withPopoverCell(
  Cell: React.ComponentType<IPopoverCellProps>,
  BasicCell: React.ForwardRefExoticComponent<
    IPopoverBasicCellProps & React.RefAttributes<any>
  >,
  options?: IPopoverCellOptions
) {
  return function PopoverCell(props: FormatterProps<any>) {
    const classes = useStyles();

    const { transparent, readOnly, ...popoverProps } = options ?? {};

    const [showComplexCell, setShowComplexCell] = useState(false);
    const basicCellRef = useRef<any>(null);

    // COPIED FROM withCustomCell
    const { updateCell } = useFiretableContext();

    // TODO: Investigate if this still needs to be a state
    const value = getCellValue(props.row, props.column.key as string);
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const basicCell = (
      <BasicCell
        value={localValue}
        name={(props.column as any).name}
        type={(props.column as any).type as FieldType}
        setShowComplexCell={setShowComplexCell}
        ref={basicCellRef}
        disabled={props.column.editable === false}
      />
    );

    if (!showComplexCell) return basicCell;

    const parentRef = basicCellRef.current?.parentElement;

    const handleSubmit = (value: any) => {
      if (updateCell && !options?.readOnly) {
        updateCell(props.row.ref, props.column.key as string, value);
        setLocalValue(value);
      }
    };

    // Switch to heavy cell Component once basic cell is clicked
    return (
      <>
        {basicCell}

        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <Suspense fallback={null}>
            <Popover
              open
              anchorEl={parentRef}
              onClose={() => setShowComplexCell(false)}
              {...popoverProps}
              PaperProps={{
                classes: {
                  root: transparent ? classes.transparentPaper : "",
                },
                ...popoverProps?.PaperProps,
              }}
            >
              <Cell
                {...props}
                docRef={props.row.ref}
                value={localValue}
                onSubmit={handleSubmit}
                disabled={props.column.editable === false}
                setShowComplexCell={setShowComplexCell}
              />
            </Popover>
          </Suspense>
        </ErrorBoundary>
      </>
    );
  };
}
