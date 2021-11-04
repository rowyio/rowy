import React, { Suspense, useState, useEffect } from "react";
import { FormatterProps } from "react-data-grid";
import { IBasicCellProps, IHeavyCellProps } from "../types";

import ErrorBoundary from "@src/components/ErrorBoundary";
import CellValidation from "@src/components/Table/CellValidation";
import { useProjectContext } from "@src/contexts/ProjectContext";

import { FieldType } from "@src/constants/fields";
import { getCellValue } from "@src/utils/fns";

/**
 * HOC to wrap table cell components.
 * Renders read-only BasicCell while scrolling for better scroll performance.
 * @param BasicCellComponent The lighter cell component to display while scrolling
 * @param HeavyCellComponent The read/write cell component to display
 * @param readOnly Prevent the component from updating the cell value
 */
export default function withHeavyCell(
  BasicCellComponent: React.ComponentType<IBasicCellProps>,
  HeavyCellComponent: React.ComponentType<IHeavyCellProps>,
  readOnly: boolean = false
) {
  return function HeavyCell(props: FormatterProps<any>) {
    const { updateCell } = useProjectContext();

    const { validationRegex, required } = (props.column as any).config;

    // Initially display BasicCell to improve scroll performance
    const [displayedComponent, setDisplayedComponent] = useState<
      "basic" | "heavy"
    >("basic");
    // Then switch to HeavyCell once completed
    useEffect(() => {
      setTimeout(() => {
        setDisplayedComponent("heavy");
      });
    }, []);

    // TODO: Investigate if this still needs to be a state
    const value = getCellValue(props.row, props.column.key);
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Declare basicCell here so props can be reused by HeavyCellComponent
    const basicCellProps = {
      value: localValue,
      name: props.column.name as string,
      type: (props.column as any).type as FieldType,
    };
    const basicCell = <BasicCellComponent {...basicCellProps} />;

    if (displayedComponent === "basic")
      return (
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <CellValidation
            value={value}
            required={required}
            validationRegex={validationRegex}
          >
            {basicCell}
          </CellValidation>
        </ErrorBoundary>
      );

    const handleSubmit = (value: any) => {
      if (updateCell && !readOnly) {
        updateCell(props.row.ref, props.column.key, value);
        setLocalValue(value);
      }
    };

    if (displayedComponent === "heavy")
      return (
        <ErrorBoundary fullScreen={false} basic wrap="nowrap">
          <Suspense fallback={basicCell}>
            <CellValidation
              value={value}
              required={required}
              validationRegex={validationRegex}
            >
              <HeavyCellComponent
                {...props}
                {...basicCellProps}
                docRef={props.row.ref}
                onSubmit={handleSubmit}
                disabled={props.column.editable === false}
              />
            </CellValidation>
          </Suspense>
        </ErrorBoundary>
      );

    // Should not reach this line
    return null;
  };
}
