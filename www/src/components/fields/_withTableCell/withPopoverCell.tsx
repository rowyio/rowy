import React, { Suspense, useState, useEffect, useRef } from "react";
import { FormatterProps } from "react-data-grid";
import {
  IBasicCellProps,
  IPopoverInlineCellProps,
  IPopoverCellProps,
} from "../types";

import {
  makeStyles,
  createStyles,
  Popover,
  PopoverProps,
} from "@material-ui/core";

import ErrorBoundary from "components/ErrorBoundary";
import CellValidation from "components/Table/CellValidation";
import { useFiretableContext } from "contexts/FiretableContext";

import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";

const useStyles = makeStyles(() =>
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
 * HOC to wrap around table cell formatters.
 * Renders read-only BasicCell while scrolling for better scroll performance.
 * When the user clicks the heavier inline cell, it displays PopoverCell.
 * @param BasicCellComponent The lighter cell component to display while scrolling
 * @param InlineCellComponent The heavier cell component to display inline
 * @param PopoverCellComponent The heavy read/write cell component to display in Popover
 * @param options See `IPopoverCellOptions`
 */
export default function withPopoverCell(
  BasicCellComponent: React.ComponentType<IBasicCellProps>,
  InlineCellComponent: React.ForwardRefExoticComponent<
    IPopoverInlineCellProps & React.RefAttributes<any>
  >,
  PopoverCellComponent: React.ComponentType<IPopoverCellProps>,
  options?: IPopoverCellOptions
) {
  return function PopoverCell(props: FormatterProps<any>) {
    const classes = useStyles();
    const { transparent, readOnly, ...popoverProps } = options ?? {};
    const { updateCell } = useFiretableContext();

    const { validationRegex, required } = (props.column as any).config;

    // Initially display BasicCell to improve scroll performance
    const [displayedComponent, setDisplayedComponent] = useState<
      "basic" | "inline" | "popover"
    >("basic");
    // Then switch to heavier InlineCell once completed
    useEffect(() => {
      setTimeout(() => {
        setDisplayedComponent("inline");
      });
    }, []);

    // Store Popover open state here so we can add delay for close transition
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Store ref to rendered InlineCell here to get positioning for PopoverCell
    const inlineCellRef = useRef<any>(null);

    // TODO: Investigate if this still needs to be a state
    const value = getCellValue(props.row, props.column.key as string);
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Declare basicCell here so props can be reused by HeavyCellComponent
    const basicCellProps = {
      value: localValue,
      name: props.column.name,
      type: (props.column as any).type as FieldType,
    };

    if (displayedComponent === "basic")
      return (
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <CellValidation
            value={value}
            required={required}
            validationRegex={validationRegex}
          >
            <BasicCellComponent {...basicCellProps} />
          </CellValidation>
        </ErrorBoundary>
      );

    const handleSubmit = (value: any) => {
      if (updateCell && !options?.readOnly) {
        updateCell(props.row.ref, props.column.key as string, value);
        setLocalValue(value);
      }
    };
    const showPopoverCell: any = (popover: boolean) => {
      if (popover) {
        setPopoverOpen(true);
        setDisplayedComponent("popover");
      } else {
        setPopoverOpen(false);
        setTimeout(() => setDisplayedComponent("inline"), 300);
      }
    };

    // Declare inlineCell and props here so it can be reused later
    const commonCellProps = {
      ...props,
      ...basicCellProps,
      column: props.column,
      onSubmit: handleSubmit,
      disabled: props.column.editable === false,
      docRef: props.row.ref,
      showPopoverCell,
      ref: inlineCellRef,
    };
    const inlineCell = (
      <InlineCellComponent {...commonCellProps} ref={inlineCellRef} />
    );

    if (displayedComponent === "inline")
      return (
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <CellValidation
            value={value}
            required={required}
            validationRegex={validationRegex}
          >
            {inlineCell}
          </CellValidation>
        </ErrorBoundary>
      );

    const parentRef = inlineCellRef.current?.parentElement;

    if (displayedComponent === "popover")
      return (
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <CellValidation
            value={value}
            required={required}
            validationRegex={validationRegex}
          >
            {inlineCell}
          </CellValidation>

          <Suspense fallback={null}>
            <Popover
              open={popoverOpen}
              anchorEl={parentRef}
              onClose={() => showPopoverCell(false)}
              {...popoverProps}
              PaperProps={{
                classes: {
                  root: transparent ? classes.transparentPaper : "",
                },
                ...popoverProps?.PaperProps,
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <PopoverCellComponent
                {...commonCellProps}
                parentRef={parentRef}
              />
            </Popover>
          </Suspense>
        </ErrorBoundary>
      );

    // Should not reach this line
    return null;
  };
}
