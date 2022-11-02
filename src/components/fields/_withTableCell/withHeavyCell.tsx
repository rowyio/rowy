import { Suspense, useState, useEffect } from "react";
import { useSetAtom } from "jotai";
import { get } from "lodash-es";
import type { TableCellProps } from "@src/components/Table";
import { IBasicCellProps, IHeavyCellProps } from "@src/components/fields/types";

import { tableScope, updateFieldAtom } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";

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
  return function HeavyCell({ row, column, getValue }: TableCellProps) {
    const updateField = useSetAtom(updateFieldAtom, tableScope);

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
    const value = getValue();
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Declare basicCell here so props can be reused by HeavyCellComponent
    const basicCellProps = {
      value: localValue,
      name: column.columnDef.meta!.name,
      type: column.columnDef.meta!.type,
    };
    const basicCell = <BasicCellComponent {...basicCellProps} />;

    if (displayedComponent === "basic") return basicCell;

    const handleSubmit = (value: any) => {
      if (readOnly) return;
      updateField({
        path: row.original._rowy_ref.path,
        fieldName: column.id,
        value,
      });
      setLocalValue(value);
    };

    if (displayedComponent === "heavy")
      return (
        <Suspense fallback={basicCell}>
          <HeavyCellComponent
            {...basicCellProps}
            row={row.original}
            column={column.columnDef.meta!}
            docRef={row.original._rowy_ref}
            onSubmit={handleSubmit}
            disabled={column.columnDef.meta!.editable === false}
          />
        </Suspense>
      );

    // Should not reach this line
    return null;
  };
}
