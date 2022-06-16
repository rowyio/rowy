import { Suspense, useState, useEffect } from "react";
import { useSetAtom } from "jotai";
import { get } from "lodash-es";
import { FormatterProps } from "react-data-grid";
import { ErrorBoundary } from "react-error-boundary";
import { IBasicCellProps, IHeavyCellProps } from "@src/components/fields/types";

import { InlineErrorFallback } from "@src/components/ErrorFallback";
import CellValidation from "@src/components/Table/CellValidation";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";
import { TableRow } from "@src/types/table";

/**
 * HOC to wrap table cell components.
 * Renders read-only BasicCell while scrolling for better scroll performance.
 * @param BasicCellComponent - The lighter cell component to display while scrolling
 * @param HeavyCellComponent - The read/write cell component to display
 * @param readOnly - Prevent the component from updating the cell value
 */
export default function withHeavyCell(
  BasicCellComponent: React.ComponentType<IBasicCellProps>,
  HeavyCellComponent: React.ComponentType<IHeavyCellProps>,
  readOnly: boolean = false
) {
  return function HeavyCell(props: FormatterProps<TableRow>) {
    const updateField = useSetAtom(updateFieldAtom, tableScope);

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
    const value = get(props.row, props.column.key);
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
        <ErrorBoundary FallbackComponent={InlineErrorFallback}>
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
      if (readOnly) return;
      updateField({
        path: props.row._rowy_ref.path,
        fieldName: props.column.key,
        value,
      });
      setLocalValue(value);
    };

    if (displayedComponent === "heavy")
      return (
        <ErrorBoundary FallbackComponent={InlineErrorFallback}>
          <Suspense fallback={basicCell}>
            <CellValidation
              value={value}
              required={required}
              validationRegex={validationRegex}
            >
              <HeavyCellComponent
                {...props}
                {...basicCellProps}
                docRef={props.row._rowy_ref}
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
