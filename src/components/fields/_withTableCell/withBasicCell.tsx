import { get } from "lodash-es";
import { FormatterProps } from "react-data-grid";
import { ErrorBoundary } from "react-error-boundary";
import { IBasicCellProps } from "@src/components/fields/types";

import { InlineErrorFallback } from "@src/components/ErrorFallback";
import CellValidation from "@src/components/Table/CellValidation";
import { FieldType } from "@src/constants/fields";
import { TableRow } from "@src/types/table";

/**
 * HOC to wrap around table cell components.
 * Renders read-only BasicCell only.
 * @param BasicCellComponent - The light cell component to display at all times
 */
export default function withBasicCell(
  BasicCellComponent: React.ComponentType<IBasicCellProps>
) {
  return function BasicCell(props: FormatterProps<TableRow>) {
    const { name, key } = props.column;
    const value = get(props.row, key);

    const { validationRegex, required } = (props.column as any).config;

    return (
      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <CellValidation
          value={value}
          required={required}
          validationRegex={validationRegex}
        >
          <BasicCellComponent
            value={value}
            name={name as string}
            type={(props.column as any).type as FieldType}
          />
        </CellValidation>
      </ErrorBoundary>
    );
  };
}
