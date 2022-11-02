import type { TableCellProps } from "@src/components/Table";
import { ErrorBoundary } from "react-error-boundary";
import { IBasicCellProps } from "@src/components/fields/types";

import { InlineErrorFallback } from "@src/components/ErrorFallback";
import CellValidation from "@src/components/Table/CellValidation";

/**
 * HOC to wrap around table cell components.
 * Renders read-only BasicCell only.
 * @param BasicCellComponent - The light cell component to display at all times
 */
export default function withBasicCell(
  BasicCellComponent: React.ComponentType<IBasicCellProps>
) {
  return function BasicCell({ row, column, getValue }: TableCellProps) {
    const columnConfig = column.columnDef.meta!;
    const { name } = columnConfig;
    const value = getValue();

    return (
      <BasicCellComponent
        value={value}
        name={name as string}
        type={columnConfig.type}
      />
    );
  };
}
