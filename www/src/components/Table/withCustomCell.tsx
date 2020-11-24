import React, { Suspense, useState, useEffect } from "react";
import { FormatterProps } from "react-data-grid";
import { ICustomCellProps, IBasicCellProps } from "components/fields/types";

import ErrorBoundary from "components/ErrorBoundary";
import { useFiretableContext } from "contexts/FiretableContext";

import { FieldType } from "constants/fields";
import { getCellValue } from "utils/fns";

/**
 * HOC to wrap around custom cell formatters.
 * Renders BasicCell while scrolling for better scroll performance.
 * @param Cell The cell component to display
 * @param BasicCell The lighter cell component to display while scrolling
 * @param readOnly Prevent the formatter from updating the cell value
 */
export default function withCustomCell(
  Cell: React.ComponentType<ICustomCellProps>,
  BasicCell: React.ComponentType<IBasicCellProps>,
  readOnly: boolean = false
) {
  return function CustomCell(props: FormatterProps<any>) {
    const { updateCell } = useFiretableContext();

    // TODO: Investigate if this still needs to be a state
    const value = getCellValue(props.row, props.column.key as string);
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Initially display BasicCell to improve scroll performance
    const basicCell = (
      <BasicCell
        value={localValue}
        name={(props.column as any).name}
        type={(props.column as any).type as FieldType}
      />
    );

    const [component, setComponent] = useState(basicCell);

    // Switch to heavy cell Component once scrolling has finished
    useEffect(() => {
      setTimeout(() => {
        setComponent(
          <ErrorBoundary fullScreen={false} basic wrap="nowrap">
            <Suspense fallback={basicCell}>
              <Cell
                {...props}
                docRef={props.row.ref}
                value={localValue}
                onSubmit={handleSubmit}
              />
            </Suspense>
          </ErrorBoundary>
        );
      });
    }, [localValue]);

    const handleSubmit = (value: any) => {
      if (updateCell && !readOnly) {
        updateCell(props.row.ref, props.column.key as string, value);
        setLocalValue(value);
      }
    };

    return component;
  };
}
